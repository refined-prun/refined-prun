/* eslint-disable @typescript-eslint/no-explicit-any */

interface WebSocketWindowMessage {
  type: WindowMessageType;
  data: any;
  id: number;
  context?: string;
  override?: boolean;
  reject?: boolean;
}
