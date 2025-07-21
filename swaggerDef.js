import swaggerJSDoc from "swagger-jsdoc";

const options={
    definition:{
        openapi: '3.0.0',
        info:{
            title:'ProjectStation API docs',
            version:'1.0.0',
            desciption:'Swagger Docuementation of APIs',
        },
        servers:[
            {
                url:"http://localhost:5155/api"
            },
        ],
    },
    apis:['./src/routes/**/route.js']
};
const swaggerSpec= swaggerJSDoc(options);
export default swaggerSpec;