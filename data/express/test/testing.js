const request = require("supertest");
// const db = require('../db')
const app = require("../app");
const http = request(app);
var user,
  token = () => ({ "x-access-token": user.data.token });

describe("Testing Page", () => {
  before((done) => {
    const signup = () =>
      http.post("/api/auth/signup").send({
        name: "admin",
        email: "admin@gmail.com",
        password: "helloworld",
      });
    const signin = () =>
      http
        .post("/api/auth/signin")
        .send({
          email: "admin@gmail.com",
          password: "helloworld",
        })
        .then((response) => {
          user = response._body;
          done();
        })
        .catch(() => done());
    /* uncomment if you use sequelize. example database name 'app_test' */
    // db.sync({ force: true, match: /_test$/ }).then(signup).then(signin)
  });
  it("get /", (done) => {
    http.get("/").expect(200, done);
  });
  describe("data example", () => {
    it("add /api/example", (done) => {
      http
        .post("/api/example")
        .set(token())
        .send({
          name: "test",
          description: "hi!",
        })
        .expect(200, done);
    });
    it("patch /api/example", (done) => {
      http
        .patch("/api/example/1")
        .set(token())
        .send({
          name: "test",
          description: "hi!",
        })
        .expect(200, done);
    });
    it("get /api/example", (done) => {
      http.get("/api/example").expect(200, done);
    });
    it("get /api/example/1", (done) => {
      http.get("/api/example/1").expect(200, done);
    });
    it("delete /api/example/1", (done) => {
      http.delete("/api/example/1").set(token()).expect(200, done);
    });
  });
});
