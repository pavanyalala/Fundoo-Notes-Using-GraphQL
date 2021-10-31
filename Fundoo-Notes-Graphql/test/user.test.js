const EasyGraphQLTester = require('easygraphql-tester')
const fs = require('fs')
const path = require('path')


const userSchema = fs.readFileSync(
    path.join(__dirname, ".", "schema.gql"),
    "utf8"
  );
  
  describe("Queries", () => {
    let tester;
    beforeAll(() => {
      tester = new EasyGraphQLTester(userSchema);
    });
  
    test("should pass with query", () => {
      const query = `
      query
      {
        getAllUsers {
          id
          firstName
          lastName
          email
          password
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
            password: "Pawan@1108!@#$"
          }]
        }
      }
      tester.setFixture(fixture);
      const result = tester.mock({ query });
      //expect(result.data.users[0].id).toBe("617eb5d26771bdb8f9ac9e66",);
      expect(result.data.users[0].firstName).toBe("pavan");
      expect(result.data.users[0].lastName).toBe("yalala");
      expect(result.data.users[0].email).toBe("pavanyalala4508@gmail.com");
      expect(result.data.users[0].password).toBe("Pawan@1108!@#$");
  
    });
  });
  describe("Mutations", () => {
    let tester;
    beforeAll(() => {
      tester = new EasyGraphQLTester(userSchema);
    });
  
  
    describe("Mutations", () => {
  
      //registerUser
  
      test("registerUser-mutationtestpass-iftheFirstargsFalse", () => {
        const mutation = `
          mutation registerUser($path: UserInput!) {
              firstName
              lastName
              email
              password
            
          }
        `;
         
        tester.test(false, mutation, {});
      });
      test("registerUser-mutationtestpass-ifInput is Invalied", () => {
        const mutation = `
        mutation registerUSer($path: UserInput!) {
          registerUser(input: $path) {
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
      
  
  
      //loginUser  Testing
      
      test("loginUser-MutationtestPass -if inputisEmpty", () => {
        const mutation = `
          mutation loginUser($input: ) {
            loginUser(input: $input) {
              id
              token
              firstName
              lastName
              email
            }
          }
        `;
        
        tester.test(false, mutation, {});
      });
  
      
      test("loginUser-MutationTestPass-TheInputHasInvalid", () => {
        const mutation = `
        mutation loginUser($input:InvalidInput) {
          loginUser(input: $input) {
            id
            token
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
       
   
   
     
      
    })
  })