const bcrypt = require("bcrypt");

module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    let passwordHash = await bcrypt.hash('123456', 10);

    await db.collection("admins").insertOne({
      username: "zikazama",
      email: "fauzi@gmail.com",
      password: passwordHash,
    });

    await db.collection("users").insertOne({
      username: "ayiputrink",
      email: "ayiputrink@gmail.com",
      password: passwordHash,
    });
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    await db.collection("admins").delete();
    await db.collection("users").delete();
  },
};
