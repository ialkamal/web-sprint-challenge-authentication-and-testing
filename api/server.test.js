// Write your tests here
// get Jokes, register and login

const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
});

afterAll(async () => {
  await db.destroy();
});

const user1 = {
  username: "ismail",
  password: "ismail",
};

const user2 = {
  username: "ismail",
  password: "basel",
};

const user3 = {
  username: "ismail",
};

test("sanity", () => {
  expect(true).not.toBe(false);
});

describe("Test Auth Endpoint", () => {
  describe("Test Post api/auth/register", () => {
    test("if returned data has the correct values upon successful registration", async () => {
      let res = await request(server).post("/api/auth/register").send(user1);

      expect(res.body.username).toBe("ismail");
      expect(res.body.id).toBe(1);
      expect(res.body.password).toBeDefined();
    });

    test("if returned status code and error message are correct upon missing password", async () => {
      let res = await request(server)
        .post("/api/auth/register")
        .send(user3)
        .expect(401);

      expect(res.body.message).toMatch(/username and password required/i);
    });
  });

  describe("Test Post api/auth/login", () => {
    beforeEach(async () => {
      await request(server).post("/api/auth/register").send(user1);
    });

    test("if a token is returned upon successful registration", async () => {
      let res = await request(server).post("/api/auth/login").send(user1);

      expect(res.body.token).toBeDefined();
    });

    test("if returned status code and error message are correct upon missing password", async () => {
      let res = await request(server)
        .post("/api/auth/login")
        .send(user2)
        .expect(403);

      expect(res.body.message).toMatch(/invalid credentials/i);
    });
  });
});

describe("Test Jokes Endpoint", () => {
  describe("Test GET api/jokes", () => {
    let res;
    beforeEach(async () => {
      await request(server).post("/api/auth/register").send(user1);
    });

    test("if returned data has a correct length upon successful login", async () => {
      res = await request(server).post("/api/auth/login").send(user1);
      let res1 = await request(server)
        .get("/api/jokes")
        .set("Authorization", `Bearer ${res.body.token}`)
        .expect(200);

      expect(res1.body).toHaveLength(3);
    });

    test("if returned correct status code upon unsuccessful login", async () => {
      res = await request(server).post("/api/auth/login").send(user2);
      await request(server)
        .get("/api/jokes")
        .set("Authorization", `Bearer ${res.body.token}`)
        .expect(403);
    });

    test("if returned correct message upon missing token", async () => {
      res = await request(server).post("/api/auth/login").send(user1);
      let res1 = await request(server).get("/api/jokes").expect(403);

      expect(res1.body.message).toMatch(/token required/i);
    });
  });
});
