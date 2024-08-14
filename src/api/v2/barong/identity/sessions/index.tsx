import { Router } from "express";

export const sessionsRouter = Router();



sessionsRouter.get('/', ((req, rep) => {
    rep.json({
        "email": "admin@barong.io",
        "uid": "ID489F525B1D",
        "role": "admin",
        "level": 1,
        "otp": true,
        "state": "active",
        "referral_uid": null,
        "data": "{\"language\":\"en\"}",
        "created_at": "2019-10-30T11:15:07Z",
        "updated_at": "2020-01-13T11:59:31Z",
        "labels": [
            { "key": "email", "value": "verified", "scope": "private", "created_at": "2019-10-30T11:15:07Z", "updated_at": "2019-10-30T11:15:07Z" },
            { "key": "phone", "value": "", "scope": "private", "created_at": "2019-12-24T12:05:26Z", "updated_at": "2019-12-24T12:05:26Z" },
            { "key": "profile", "value": "", "scope": "private", "created_at": "2020-01-15T19:33:17Z", "updated_at": "2020-01-15T19:33:17Z" },
            { "key": "document", "value": "pending", "scope": "private", "created_at": "2020-01-15T19:34:04Z", "updated_at": "2020-01-15T19:34:04Z" }
        ],
        "phones": [
            { "country": "UA", "number": "380504403893", "validated_at": "2019-12-24T12:05:26.000Z" }
        ],
        "data_storages": [],
        "csrf_token": "wddwew33r",
        "profiles": [
            {
                "address": null,
                "city": null,
                "country": null,
                "dob": "1999-05-21",
                "first_name": "Louisa",
                "last_name": "Break",
                "postcode": null,
                "state": "verified",
                "updated_at": "2019-01-10T17:06:37Z",
                "created_at": "2019-01-10T17:06:37Z",
                "metadata": "{\"nationality\": \"Ukrainian\"}"
            },
            {
                "address": null,
                "city": null,
                "country": null,
                "dob": "1999-05-21",
                "first_name": "Marianna",
                "last_name": "The Best",
                "postcode": null,
                "state": "verified",
                "updated_at": "2019-02-10T17:06:37Z",
                "created_at": "2019-02-10T17:06:37Z",
                "metadata": "{\"nationality\": \"Ukrainian\"}"
            },
            {
                "address": null,
                "city": null,
                "country": null,
                "dob": "1999-05-21",
                "first_name": "Rejected",
                "last_name": "The Best",
                "postcode": null,
                "state": "rejected",
                "updated_at": "2019-02-10T17:06:37Z",
                "created_at": "2019-02-10T17:06:37Z",
                "metadata": "{\"nationality\": \"Ukrainian\"}"
            },
            {
                "address": null,
                "city": null,
                "country": null,
                "dob": "1999-05-21",
                "first_name": "Antoinette",
                "last_name": "Ferguson",
                "postcode": null,
                "state": "verified",
                "updated_at": "2019-03-10T17:06:37Z",
                "created_at": "2019-03-10T17:06:37Z",
                "metadata": "{\"nationality\": \"Ukrainian\"}"
            }
        ]
    }
    )
}))