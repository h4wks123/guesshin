import type { GameStore, StoredGame } from "./game-session";

export const GAME_TTL_MS = 60 * 60 * 1000;

export class DurableObjectGameStore implements GameStore {
  constructor(private readonly ctx: DurableObjectState) {}

  load(): Promise<StoredGame | undefined> {
    return this.ctx.storage.get<StoredGame>("game");
  }

  async save(state: StoredGame): Promise<void> {
    await this.ctx.storage.put("game", state);
    await this.ctx.storage.setAlarm(Date.now() + GAME_TTL_MS);
  }

  clear(): Promise<void> {
    return this.ctx.storage.deleteAll();
  }

  setAlarm(time: number): Promise<void> {
    return this.ctx.storage.setAlarm(time);
  }
}
