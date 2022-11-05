require("dotenv").config();
const app = require("../app");
const request = require("supertest");
const { sequelize, Favourite, User, Food } = require("../models");
const { queryInterface } = sequelize;
const { createSign, verifyToken } = require("../helpers/jwt");
const { hashPass } = require("../helpers/bcrypt")

jest.setTimeout(1000);

let dataFood = require("../data/foods.json");
let foods = dataFood.food.map((el) => {
    el.createdAt = el.updatedAt = new Date();
    return el;
});

let dataUser = require("../data/users.json")
let users = dataUser.users.map((el) => {
    el.createdAt = el.updatedAt = new Date();
    el.password = hashPass(el.password)
    return el;
})

const user_access_token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJyZXNjdWVmb29kQGdtYWlsLmNvbSIsImlhdCI6MTY2NzY0OTE1Mn0.Sqkgx312hBggjPziUR-QqYZD4mf8Le70OfR_HEyjhG0";

// beforeAll(async () => {
//     await queryInterface.bulkInsert("Food", foods);
//     await queryInterface.bulkInsert("User", users);
// })

// afterAll(async () => {
//     await queryInterface.bulkDelete(`Food`, null, {
//     truncate: true,
//     cascade: true,
//     restartIdentity: true,
//     });
//     await queryInterface.bulkDelete(`User`, null, {
//     truncate: true,
//     cascade: true,
//     restartIdentity: true,
//     });
// });

describe("Favourite Routes Test", () => {
    describe("POST /favorites - create new favourite", () => {
        test("201 Success added favourite - should create new favourite", (done) => {
            request(app)
                .post("/favorites")
                .send({FoodId: 5})
                .set({access_token: user_access_token})
                .then((response) => {
                    const { body, status } = response;
                    expect(status).toBe(201);
                    expect(body).toHaveProperty("message", "Favourite success to create");
                    return done();
                })
                .catch((err) => {
                    done(err)
                })
        });

        test("401 Failed added favourite with invalid token - should return error unauthorized", (done) => {
            request(app)
                .post("/favorites")
                .set("access_token", "ini invalid token")
                .send({FoodId: 1})
                .then((response) => {
                    const { body, status } = response;
                    expect(status).toBe(401);
                    expect(body).toHaveProperty("message", "Invalid token");
                    return done();
                })
                .catch((err) => {
                    done(err)
                })
        });
    });

    describe("GET /favorites - return data all favourites", () => {
        test("200 Success get all favourites, return array", (done) => {
        request(app)
            .get("/favorites")
            .set("access_token", user_access_token)
            .then((response) => {
            const { body, status } = response;
            expect(status).toBe(200);
            // console.log(response.body)
            expect(body[0]).toHaveProperty("id", expect.any(Number));
            expect(body[0]).toHaveProperty("UserId", expect.any(Number));
            expect(body[0]).toHaveProperty("FoodId", expect.any(Number));
            expect(body[0].User).toBeInstanceOf(Object);
            expect(body[0].Food).toBeInstanceOf(Object);
            done();
            })
            .catch((err) => {
            done(err);
            });
        });

        test("401 Failed get favourite with invalid token - should return error unauthorized", (done) => {
            request(app)
                .get("/favorites")
                .set("access_token", "ini invalid token")
                .then((response) => {
                    const { body, status } = response;
                    expect(status).toBe(401);
                    expect(body).toHaveProperty("message", "Invalid token");
                    return done();
                })
                .catch((err) => {
                    done(err)
                })
        });
    });
    
});

//   describe("DELETE /favorites/:id", () => {
//     describe("Success attempt", () => {
//       describe("Deleting with valid token", () => {
//         it("Should return status code 200", async () => {
//           const response = await request(app)
//             .delete(`/favorites/${commentId}`)
//             .set({ access_token: validToken });
//           const { body, status } = response;
//           expect(status).toBe(200);
//           expect(body).toHaveProperty("msg", expect.any(String));
//         });
//       });
//     });
//     describe("Failed attempt", () => {
//       describe("Deleting with invalid  token", () => {
//         it("Should return status code 401", async () => {
//           const response = await request(app)
//             .delete("/favorites/1")
//             .set({ access_token: invalidToken });
//           const { body, status } = response;
//           expect(status).toBe(401);
//           expect(body).toHaveProperty("message", expect.any(String));
//         });
//       });
//       describe("Deleting without params or target for deleting is undefined", () => {
//         it("Should return status code 404", async () => {
//           const response = await request(app)
//             .delete("/favorites/100")
//             .set({ access_token: validToken });
//           const { body, status } = response;
//           expect(status).toBe(404);
//           expect(body).toHaveProperty("message", expect.any(String));
//         });
//       });
//     });
//   });
