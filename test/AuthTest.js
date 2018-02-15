import { isError } from 'util';

'use strict';

const chai = require('chai')
const expect = require('chai').expect
const should = require('chai').should();


const app = require('../src/index')

chai.use(require('chai-http'));

describe('Authentication API', () => {
    const credentials = {
        "credentials": {
            "email": "test@test.com",
            "password": "12345"
        }
    }
    const badCredentials = {
        "credentials": {
            email: "test1@test.com",
            password: "123456"
        }
    }
    const route = "/api/auth";

    it('should return user object', () => {
        return chai.request(app)
            .post(route)
            .send(credentials)
            .then(res => {
                const { user } = res.body;
                user.should.have.property('email')
                expect(user.email).to.have.lengthOf.above(0);
                user.should.have.property('token')
                expect(user.token).to.have.lengthOf.above(0);
                user.should.have.property('name')
                expect(user.name).to.have.lengthOf.above(0);
                user.should.have.property('id')
            })
    })

    it('should return invalid credentials', () => {
        return chai.request(app)
            .post(route)
            .send(badCredentials)
            .catch(err => {
                err.response.should.have.status(404);
                err.response.body.should.have.property('errors')
                err.response.body.errors.global.should.eql("Invalid credentials")
            })
    })

})


