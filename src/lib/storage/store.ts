import fs from "fs";
import path from "path";
import { DealRecord } from "../../agents/NegotiationEngine.js";

const DB_FILE = path.join(process.cwd(), "db.json");

interface DatabaseSchema {
  deals: DealRecord[];
}

export class DealStore {
  private static readDb(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_FILE)) {
        this.writeDb({ deals: [] });
        return { deals: [] };
      }
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data) as DatabaseSchema;
    } catch (e) {
      console.error("Error reading database:", e);
      return { deals: [] };
    }
  }

  private static writeDb(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing to database:", e);
    }
  }

  public static getDeals(): DealRecord[] {
    return this.readDb().deals;
  }

  public static getDeal(id: string): DealRecord | undefined {
    return this.readDb().deals.find(d => d.id === id);
  }

  public static saveDeal(deal: DealRecord): void {
    const db = this.readDb();
    const index = db.deals.findIndex(d => d.id === deal.id);
    if (index >= 0) {
      db.deals[index] = deal;
    } else {
      db.deals.push(deal);
    }
    this.writeDb(db);
  }

  public static clearStore(): void {
    this.writeDb({ deals: [] });
  }
}
