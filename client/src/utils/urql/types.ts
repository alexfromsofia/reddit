import { Data, ResolveInfo, Variables } from "@urql/exchange-graphcache";

export type UrqlResolver = (
  _result: Data,
  args: Variables,
  cache: Cache,
  info: ResolveInfo
) => void;
