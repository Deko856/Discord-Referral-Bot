const sqlite3 = require("better-sqlite3");

module.exports = class Data {
  db;

  constructor() {
    this.db = new sqlite3("data.db");
    this.db.prepare("CREATE TABLE IF NOT EXISTS member_cache (guild TEXT PRIMARY KEY UNIQUE NOT NULL, members TEXT)").run();
    this.db.prepare("CREATE TABLE IF NOT EXISTS invites_cache (invite TEXT PRIMARY KEY UNIQUE NOT NULL, guild TEXT NOT NULL, amount NUMBER)").run();
    this.db.prepare("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY NOT NULL, guild TEXT NOT NULL, referralCode TEXT UNIQUE, referrals NUMBER, fakeReferrals NUMBER)").run();
  }

  /**
   * @param {string} guild
   * @param {{id: string}[]} members 
   */
  cacheExistingMembers(guild, members) {
    var row = this.db.prepare("SELECT * FROM member_cache WHERE guild=?").get(guild);
    if (!row) row = { guild: guild, members: "[]" }
    const data = JSON.parse(row.members);
    data.push(...members.map(m => m.id));
    this.db.prepare("UPDATE member_cache SET members=? WHERE guild=?").run(JSON.stringify(data), guild);
    this.db.prepare("INSERT OR IGNORE INTO member_cache (guild, members) VALUES (?, ?)").run(guild, JSON.stringify(data));
  }

  /**
   * @param {string} guild 
   * @param {string} user 
   */
  cacheFirstTimeJoin(guild, user) {
    var row = this.db.prepare("SELECT * FROM member_cache WHERE guild=?").get(guild);
    if (!row) row = { guild: guild, members: "[]" }
    const data = JSON.parse(row.members);
    data.push(user);
    this.db.prepare("UPDATE member_cache SET members=? WHERE guild=?").run(JSON.stringify(data), guild);
    this.db.prepare("INSERT OR IGNORE INTO member_cache (guild, members) VALUES (?, ?)").run(guild, JSON.stringify(data));
  }

  /**
   * @param {string} guild 
   * @param {string} user 
   * @returns {number}
   */
  getFakeReferralCount(guild, user) {
    const row = this.db.prepare("SELECT * FROM users WHERE guild=? AND id=?").get(guild, user);
    if (!row) return;
    return row.fakeReferrals;
  }

  /**
   * @param {string} guild 
   * @param {string} invite
   * @returns {number}
   */
  getInviteAmount(guild, invite) {
    const row = this.db.prepare("SELECT * FROM invites_cache WHERE guild=? AND invite=?").get(guild, invite);
    if (!row) return;
    return row.amount;
  }

  /**
   * @param {string} guild 
   * @param {string} user 
   * @returns {string}
   */
  getReferralCode(guild, user) {
    const row = this.db.prepare("SELECT * FROM users WHERE guild=? AND id=?").get(guild, user);
    if (!row) return;
    return row.referralCode;
  }

  /**
   * @param {string} guild 
   * @param {string} user 
   * @returns {number}
   */
  getReferralCount(guild, user) {
    const row = this.db.prepare("SELECT * FROM users WHERE guild=? AND id=?").get(guild, user);
    if (!row) return;
    return row.referrals;
  }

  /**
   * @param {string} guild
   * @param {string} user
   * @returns {{id: string, referralCode: string, referrals: number, fakeReferrals: number}}
   */
  getReferralData(guild, user) {
    const row = this.db.prepare("SELECT * FROM users WHERE guild=? AND id=?").get(guild, user);
    if (!row) return;
    return row;
  }

  /**
   * @param {string} guild 
   * @returns {{id: string, referralCode: string, referrals: number}[]}
   */
  getTopReferrers(guild) {
    const rows = this.db.prepare("SELECT * FROM users WHERE referrals!=0 ORDER BY referrals DESC").all();
    return rows.splice(0, Math.min(10, rows.length));
  }

  /**
   * @param {string} guild 
   * @param {string} invite 
   * @returns {number}
   */
  getUserFromInvite(guild, invite) {
    const row = this.db.prepare("SELECT * FROM users WHERE guild=? AND referralCode=?").get(guild, invite);
    if (!row) return;
    return row.id;
  }

  /**
   * @param {string} guild 
   * @param {string} member 
   */
  isFirstTimeJoin(guild, member) {
    const row = this.db.prepare("SELECT * FROM member_cache WHERE guild=?").get(guild);
    const data = JSON.parse(row.members);
    return !data.includes(member);
  }

  /**
   * @param {string} guild
   * @param {string} user
   * @param {number} amount
   */
  setFakeReferralCount(guild, user, amount) {
    this.db.prepare("UPDATE users SET fakeReferrals=? WHERE guild=? AND id=?").run(amount, guild, user);
  }

  /**
   * @param {string} guild 
   * @param {string} invite 
   * @param {number} amount 
   */
  setInviteAmount(guild, invite, amount) {
    this.db.prepare("UPDATE invites_cache SET amount=? WHERE invite=? AND guild=?").run(amount, invite, guild);
    this.db.prepare("INSERT OR IGNORE INTO invites_cache (invite, guild, amount) VALUES (?, ?, ?)").run(invite, guild, amount);
  }

  /**
   * @param {string} guild
   * @param {string} user
   * @param {string} code
   */
  setReferralCode(guild, user, code) {
    this.db.prepare("UPDATE users SET referralCode=? WHERE guild=? AND id=?").run(code, guild, user);
    this.db.prepare("INSERT OR IGNORE INTO users (id, guild, referralCode, referrals, fakeReferrals) VALUES (?, ?, ?, ?, ?)").run(user, guild, code, 0, 0);
  }

  /**
   * @param {string} guild
   * @param {string} user
   * @param {number} amount
   */
  setReferralCount(guild, user, amount) {
    this.db.prepare("UPDATE users SET referrals=? WHERE guild=? AND id=?").run(amount, guild, user);
  }
}