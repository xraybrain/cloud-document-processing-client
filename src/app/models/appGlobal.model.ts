import { isDevMode } from "@angular/core";

export default class AppGlobal {
  static getBaseUrl(): string {
    return isDevMode() ? "http://localhost:3000" : "";
  }

  static formatSize(size: number): string {
    const units = [
      { unit: "KB", base: 1000 },
      { unit: "MB", base: 1000000 },
      { unit: "GB", base: 1000000000 },
      { unit: "TB", base: 1000000000000 },
    ];
    let formatted: string;

    for (const u of units) {
      if (size / u.base <= 1000) {
        formatted = `${Math.floor((size / u.base) * 10) / 10} ${u.unit}`;
        break;
      }
    }
    if (!formatted) {
      formatted = `${size} B`;
    }
    return formatted;
  }
}
