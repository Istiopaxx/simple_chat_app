export class CreatePrivateMessageDto {
  room: string;
  from: string;
  content: string;
}

export class CreateGlobalMessageDto {
  from: string;
  content: string;
}
