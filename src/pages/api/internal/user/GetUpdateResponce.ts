import type AssistentResponce from "./AssistentResponce";

export default class GetUpdateResponce {
  public constructor(
    public isResponded: boolean,
    public isError: boolean,
    public response: AssistentResponce | null
  ) {}
}
