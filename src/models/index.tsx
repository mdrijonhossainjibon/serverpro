// models/order.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface Order extends Document {
  pair: string;
  status: 'open' | 'close' | 'wait';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  pair: { type: String, required: true },
  status: { type: String, enum: ['open', 'close', 'wait'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<Order>('Order', OrderSchema);
