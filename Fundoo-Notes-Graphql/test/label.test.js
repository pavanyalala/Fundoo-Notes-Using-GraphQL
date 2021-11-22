const EasyGraphQLTester = require('easygraphql-tester')
const fs = require('fs')
const path = require('path')

const resolvers = require('../app/resolver/labelresolver')
const userSchema = fs.readFileSync(
    path.join(__dirname, ".", "schema.gql"),
    "utf8"
);

describe("Query", () => {
    let tester;
    beforeAll(() => {
        tester = new EasyGraphQLTester(userSchema);
    });

    test("Mocking Label Query", () => {
        const query = `
    query
    {
        getLabel
        {
          labelName
          noteId
        }
    }
    `;
        const fixture = {
            data: {
                getLabel: [
                    {
                        labelName: "Label one",
                        noteId: [
                            "6181e88c4f3d2a808403c63d"
                        ]
                    }]
            }
        }
    });
});
describe("Mutations", () => {
    let tester;
    beforeAll(() => {
        tester = new EasyGraphQLTester(userSchema);
    });


    describe("Mutations", () => {
        //createLabel Mutation Test Cases

        test("Given_createLabel_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
            const mutation = `
        mutation createLabel($path: LabelInput) {
          createLabel(path: ) 
        }
      `;
            tester.test(false, mutation, {});
        });
    })
    test("Given_createLabel_MutationShouldPass_IfTheFirstArg_IsFalse_And_TheInputHasInvalidField", () => {
        const mutation = `
        mutation createLabel($path: InvalidInput!) {
            createLabel(path: $path) 
          }
        `;
        tester.test(false, mutation, [
            {
                String
            }
        ]);
    });
    test("Given_createLabel_MutationShouldPass_IfTheFirstArgIsTrue_And_TheInputIsValid", () => {
        const mutation = `
        mutation createLabel($path: LabelInput) {
            createLabel(path: $path) 
          }
        `;
        tester.test(true, mutation, {
            createLabel: "New Label Created Sucessfully",
            userId:"619b4b5c95890cf8caa3e96e"
        });
    });

    //deleteLabel Mutation Test Cases
    test("Given_deleteLabel_MutationShouldPass_IfTheFirstArgIsFalse_AndTheInputIsEmpty", () => {
        const mutation = `
    mutation deleteLabel($path: DeleteLabelInput) {
      deleteLabel(path: ) 
    }
  `;
       
        tester.test(false, mutation, {});
    });
    test("Given_deleteLabel_MutationShouldPass_IfTheFirstArg_IsFalse_And_TheInputHasInvalidField", () => {
        const mutation = `
        mutation deleteLabel($path: InvalidInput) {
            deleteLabel(path: $path) 
          }
        `;
        tester.test(false, mutation, [
            {
                String
            }
        ]);
    });
    test("Given_deleteLabel_MutationShouldPass_IfTheFirstArgIsTrue_And_TheInputIsValid", () => {
        const mutation = `
        mutation deleteLabel($path: DeleteLabelInput) {
            deleteLabel(path: $path) 
          }
        `;
        tester.test(true, mutation, {
            deleteLabel: "Deleted Sucessfully"
        });
    });
    
})