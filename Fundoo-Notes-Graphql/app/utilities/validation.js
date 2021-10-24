const Joi = require('joi');

class joiValidation {
    authRegister =
        Joi.object({
            firstName: Joi.string()
                .required()
                .pattern(new RegExp('[A-Za-z]')),

            lastName: Joi.string()
                .required()
                .pattern(new RegExp('[A-Za-z]')),

            email: Joi.string()
                .required()
                .pattern(new RegExp('^[a-zA-z]{3}([+-_ .]*[a-zA-Z0-9]+)*[@][a-zA-z0-9]+(.[a-z]{2,3})*$')),
                

            password: Joi.string()
                .required()
                .pattern(new RegExp('[A-Za-z0-9]{2,}[$&+,:;=?@#|<>.^*()%!-]{2,}')),
                
                _id: Joi.required(),
            
        })
    }

    module.exports = new joiValidation();