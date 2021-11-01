const EasyGraphQLTester = require('easygraphql-tester')
const fs = require('fs')
const path = require('path')


const userSchema = fs.readFileSync(
  path.join(__dirname, ".", "schema.gql"),
  "utf8"
);

describe("Query", () => {
  let tester;
  beforeAll(() => {
    tester = new EasyGraphQLTester(userSchema);
  });

  test("Mocking User Query", () => {
    const query = `
    query
    {
      getAllUsers {
        id
        firstName
        lastName
        email
      }
    }
    `;

    const fixture = {
      data: {
        getAllUsers: [{
          id: "617eb5d26771bdb8f9ac9e66",
          firstName: "pavan",
          lastName: "yalala",
          email: "pavanyalala4508@gmail.com",
        }]
      }
    }
    tester.setFixture(fixture);
    const result = tester.mock({ query });
    expect(result.data.getAllUsers[0].id).toBe("617eb5d26771bdb8f9ac9e66",);
    expect(result.data.getAllUsers[0].firstName).toBe("pavan");
    expect(result.data.getAllUsers[0].lastName).toBe("yalala");
    expect(result.data.getAllUsers[0].email).toBe("pavanyalala4508@gmail.com");

  });
});
describe("Mutations", () => {
  let tester;
  beforeAll(() => {
    tester = new EasyGraphQLTester(userSchema);
  });


  describe("Mutations", () => {

    //registerUser Test Cases

    test("Given_registerUser_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
      const mutation = `
        mutation registerUser($path : UserInput!) {
          registerUser(path: $path) {
            firstName
            lastName
            email
            password
          }
        }
      `;
      tester.test(false, mutation, {});
    });
    test("Given_registerUser_MutationShouldPass_IfTheFirstArg_IsFalse_And_TheInputHasInvalidField", () => {
      const mutation = `
      mutation registerUser($path: UserInput!) {
        registerUser(path: $path) {
          firstName
          lastName
          email
          password
        }
        }
      `;
      tester.test(false, mutation, [
        {
          firstName: "pavan",
          lastName: "yalala",
          email: "pavanyalala4508@gmail.com",
        }
      ]);
    });
    test("Given_registerUser_MutationShouldPass_IfTheFirstArgIsTrue_And_TheInputIsValid", () => {
      const mutation = `
        mutation registerUser($path: UserInput) {
          registerUser(path: $path) {
          firstName
          }
        }
      `;
      tester.test(true, mutation, {
        firstName: "pavan",
        lastName: "yalala",
        email: "pavanyalala4508@gmail.com",
      });
    });


    //loginUser Mutation Testing
    test("Given_loginUser_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
      const mutation = `
        mutation loginUser($input:LoginInput) {
          loginUser(input: $input) {
            id
            token
            firstName
            lastName
            email
            getNotes
          }
        }
      `;
      tester.test(false, mutation, {});
    });
    test("Given_loginUser_MutationShouldPass_IfTheFirstArg_IsFalse_And_TheInputHasInvalidField", () => {
      const mutation = `
      mutation loginUser($path:InvalidInput) {
        loginUser(path: $path) {
          id
          firstName
          lastName
          email
        }
      }
      `;
      tester.test(false, mutation, [
        {
          firstName: "pavan",
          lastName: "yalala",
          email: "pavanyalala4508@gmail.com",
        }
      ]);
    });
    test("Given_loginUser_MutationShouldPass_IfTheFirstArgIsTrue_And_TheInputIsValid", () => {
      const mutation = `
      mutation loginUser($path:LoginInput) {
        loginUser(path: $path) {
          id
          firstName
          lastName
          email
        }
      }
      `;
      
      tester.test(true, mutation, [{
        id: "617eb5d26771bdb8f9ac9e66",
        firstName: "pavan",
        lastName: "yalala",
        email: "pavanyalala4508@gmail.com",
      }]);
    });  
  })
})