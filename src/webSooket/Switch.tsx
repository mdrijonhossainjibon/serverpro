import { NOSQL } from "Database";
import { Socket } from "./Server";
import { UAParser } from "ua-parser-js";
import jwt from 'jsonwebtoken'
import { SMTP_SERVICE } from "api/v2/barong/identity/users/SMTP";
import { randomBytes } from "crypto";
interface SocketTypes {
  streams: string[];
  event: 'subscribe' | 'unsubscribe' | 'login' | 'auth_otp' | 'with_otp' | 'auth_link';
}

interface Payload {
  [pair: string]: string[];
}


const SmptpSend = new SMTP_SERVICE()


Socket.on('message', async ({ clientId, message }) => {

 

  try {
    const parsedMessage: SocketTypes = JSON.parse(message);


    switch (parsedMessage.event) {
      case 'subscribe':
        const existingSubscription = await NOSQL.SubscriptionModel.findOne({ clientId });

        if (
          existingSubscription &&
          existingSubscription.streams.filter((value: any) => parsedMessage.streams.includes(value)).length > 0
        ) {
          return Socket.sendMessageById(clientId, 'Error Already Subscribed Streams ' + parsedMessage.streams);
        }

        handleSubscription(clientId, parsedMessage.streams);

        break;
      case 'unsubscribe':
        handleUnsubscription(clientId, parsedMessage.streams);
        break
      case 'login':
        handelLogin(clientId, parsedMessage.streams)
        break;
      case 'auth_link':
        handelLinkGenate(clientId, parsedMessage.streams)
      default:
        const errorMessage = { error: 'Unknown event type', eventType: parsedMessage };

        break;
    }
  } catch (error) {
    Socket.sendMessageById(clientId, JSON.stringify(error));
    console.log(error)
  }


});


async function handleSubscription(clientId: string, streams: string[]) {

  if (!Array.isArray(streams)) {
    return Socket.sendMessageById(clientId, JSON.stringify({
      error: 'Error: Invalid stream format. Must be an array of strings. ❌',
      streams,
    }));

  } else if (streams.length === 0) {
    return Socket.sendMessageById(clientId, JSON.stringify({
      error: 'Error: Empty streams array. Must provide at least one stream. ❌',
      example: 'Example stream format: <symbol>.<event>-<options>',
      streams,
    }));
  }
  else {
    const clientSubscription = await NOSQL.SubscriptionModel.findOne({ clientId });
    if (!clientSubscription) {
      await NOSQL.SubscriptionModel.create({ clientId, streams });
    } else {
      await NOSQL.SubscriptionModel.findOneAndUpdate({ clientId }, { $addToSet: { streams: { $each: streams } } });
    }
  }
}


async function handleUnsubscription(clientId: string, streamsToRemove: string[]) {
  const clientSubscription = await NOSQL.SubscriptionModel.findOne({ clientId });

  if (!clientSubscription) {
    return Socket.sendMessageById(clientId, JSON.stringify({ error: 'No Subscriptions active' }));
  }

  if (clientSubscription) {
    // Remove the specified streams from the client's subscriptions
    await NOSQL.SubscriptionModel.findOneAndUpdate(
      { clientId },
      { $pull: { streams: { $in: streamsToRemove } } }
    );


    // If the client has no more subscriptions, remove them from globalStore
    if (clientSubscription.streams.length < 0) {
      await clientSubscription.deleteOne({ clientId });
    }
  }


}



const handelLogin = async (chat: string, message: string[]) => {

  const ua = new UAParser(message[1]);

  const os = ({data , state } : { data ? : any , state ? : string}) => {
    if (data) {
      return { ...data }
    }

    if (ua.getOS().name === 'Windows') {
      return { "note": `Login ${state ? state : 'pending'} on PC` }
    }
    if (ua.getOS().name === 'Android') {
      return { "note": `Login ${state ? state : 'pending'} on Android` }
    }
    if (ua.getOS().name === 'Mac OS') {
      return { "note": `Login ${state ? state : 'pending'} on MacBook` }
    }
    if (ua.getOS().name === 'iOS') {
      return { "note": `Login ${state ? state : 'pending'} on iPhone` }
    }

  }

  // Find the user activity
  const Activity = await NOSQL.UserActivity.findOne({ user_agent: message[1], token: message[0] , uid : message[2] });

  if (!Activity) {
    return Socket.sendMessageById(chat, JSON.stringify({ "api-version": "1.0", statusCode: 403, message: { error: `identity.session.erorr` } }))
  }



  const now = Date.now();
  const tokenCreatedAt = new Date(Activity.created_at).getTime();
  const tokenExpired = now - tokenCreatedAt > 225 * 60 * 1000; // 5 minutes in 

  if (tokenExpired) {
    return Socket.sendMessageById(chat, JSON.stringify({ "api-version": "1.0", event: 'login', statusCode: 403, message: { error: `Oops, your verification link has expired` } }))
  }
  const user = await NOSQL.UserModel.findOne({ uid: Activity.uid }).select(['email', 'uid', 'role', 'level', 'referral_uid', 'data', 'two_factor_auth', 'status', 'created_at', 'updated_at'])
  if (!user) {
    return Socket.sendMessageById(chat, JSON.stringify({ "api-version": "1.0", statusCode: 403, message: { error: 'identity.user_doesnt_exist' } }))
  }

  const data = {
    email: user.email, uid: user.uid, role: user.role, level: user.level, referral_uid: user.referral_uid,
    data: user.data, two_factor_auth: user.two_factor_auth, status: user.status, created_at: user.created_at, updated_at: user.updated_at
  }
  const token = jwt.sign({ user: data }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '24h' });

  const result = { ...data, phones: {}, profiles: {}, csrf_token: token };

  Activity.result = 'succeed';
  Activity.data = JSON.stringify(os({ state : 'succeed'}));
  Activity.save();
  return Socket.sendMessageById(chat, JSON.stringify({ "api-version": "2.0", event: 'login', statusCode: 200, message: { success: 'page.header.signUp.message.success' }, result: { user: result } }))

}


const handelLinkGenate = async (clientId: string, message: string[]) => {
  const ua = new UAParser(message[1]);
  const Activity = await NOSQL.UserActivity.findOne({ user_agent: message[1], token: message[0] , uid : message[2]});

  if (!Activity) {
    return Socket.sendMessageById(clientId, JSON.stringify({ "api-version": "1.0", statusCode: 403, message: { error: `identity.session.erorr` } }))
  }
  const user = await NOSQL.UserModel.findOne({ uid: Activity.uid }).select(['email'])
  if (!user) {
    return Socket.sendMessageById(clientId, JSON.stringify({ "api-version": "1.0", statusCode: 403, message: { error: 'identity.user_doesnt_exist' } }))
  } 
  const txhash = randomBytes(64).toString('hex')

  Activity.token = txhash;
  Activity.created_at = new  Date()
   await  Activity.save()
  SmptpSend.sendVerificationEmail({ to: user.email, subject: 'Email Verification', link : `${process.env.BASE_URL || undefined}/email/verified/${ txhash}/${user.uid}` });
}