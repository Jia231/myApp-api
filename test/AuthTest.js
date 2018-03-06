import { isError } from 'util';

'use strict';

const chai = require('chai')
const expect = require('chai').expect
const should = require('chai').should();


const app = require('../src/index')

chai.use(require('chai-http'));

const user_credentials = {
    "credentials": {
        "email": "test@test.com",
        "password": "12345"
    }
}

describe('Authentication API', () => {

    const badCredentials = {
        "credentials": {
            email: "test1@test.com",
            password: "123456"
        }
    }
    const route = "/api/auth";

    //if api returns cookie
    it('should return a cookie', () => {
        return chai.request(app)
            .post(route)
            .send(user_credentials)
            .then(res => {
                const headers = res.headers;
                headers.should.have.property("set-cookie")
                //console.log(res.headers["set-cookie"])
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

    describe('Movie route', () => {
        const route = "/api/movie/userCollection";
        const cookieExpiredToken = 'user=%7B%22user%22%3A%7B%22email%22%3A%22test%40test.com%22%2C%22name%22%3A%22Jia%20Ming%20Liou%22%2C%22id%22%3A0%2C%22token%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoiSmlhIE1pbmcgTGlvdSIsImlkIjowLCJpYXQiOjE1MjAyMDA2MzAsImV4cCI6MTUyMDIwMDYzMX0.2sfbjeyPoDTZOFTNzG-wGAMKKqoEi6kiA1Ruaw6RGgM%22%7D%7D; Max-Age=900; Path=/; Expires=Sun, 04 Mar 2018 22:12:10 GMT; HttpOnly';
        it('should return unathorized with expired token', () => {
            return chai.request(app)
                .post(route)
                .set('Cookie', cookieExpiredToken)
                .catch(err => {
                    err.response.should.have.status(401);
                    err.response.body.errors.should.eql('jwt expired');
                })
        })
        const cookieBadSignatureToken = 'user=%7B%22user%22%3A%7B%22email%22%3A%22test%40test.com%22%2C%22name%22%3A%22Jia%20Ming%20Liou%22%2C%22id%22%3A0%2C%22token%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoiSmlhIE1pbmcgTGlvdSIsImlkIjowLCJpYXQiOjE1MTk3MDQwMDN9.nz4KbVmNQ1kIP3CRjGPTWB97cGHHB-xUl82d4jpnXKw%22%7D%7D; Max-Age=900; Path=/; Expires=Sun, 04 Mar 2018 22:12:10 GMT; HttpOnly';
        it('should return unathorized with expired token', () => {
            return chai.request(app)
                .post(route)
                .set('Cookie', cookieBadSignatureToken)
                .catch(err => {
                    err.response.should.have.status(401);
                    err.response.body.errors.should.eql('invalid signature');
                })
        })
        let cookieWithValidToken = "";
        before(() => {
            return chai.request(app)
                .post("/api/auth")
                .send(user_credentials)
                .then(res => {
                    cookieWithValidToken = res.headers["set-cookie"];
                })
        })
        it('should return users movies collection', () => {
            return chai.request(app)
                .post(route)
                .set('Cookie', cookieWithValidToken)
                .then(res => {
                    res.body.should.have.property('movies')
                })
        })
    })



    //if api returns just json, for this route should return res.json()
    /*it('should return user object', () => {
        return chai.request(app)
            .post(route)
            .send(user_credentials)
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
    })*/

    /*
    //expired token
    const expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoiSmlhIE1pbmcgTGlvdSIsImlkIjowLCJpYXQiOjE1MTk3MDQwMDMsImV4cCI6MTUxOTc5MDQwM30.nz4KbVmNQ1kIP3CRjGPTWB97cGHHB-xUl82d4jpnXKw";
    
    //invalid signature
    const badSignatureToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoiSmlhIE1pbmcgTGlvdSIsImlkIjowLCJpYXQiOjE1MTk3MDQwMDN9.nz4KbVmNQ1kIP3CRjGPTWB97cGHHB-xUl82d4jpnXKw";
    
    let validToken = "";
    
    describe('Movie route', () => {
    
        const route = "/api/movie/userCollection";
        it('should return unathorized with invalid signature', () => {
            const credentials = { token: badSignatureToken }
            return chai.request(app)
                .post(route)
                .send(credentials)
                .catch(err => {
                    err.response.should.have.status(401);
                    err.response.body.errors.should.eql('invalid signature');
                })
        })
    
        it('should return unathorized with expired token', () => {
            const credentials = { token: expiredToken }
            return chai.request(app)
                .post(route)
                .send(credentials)
                .catch(err => {
                    err.response.should.have.status(401);
                    err.response.body.errors.should.eql('jwt expired');
                })
        })
    
        //fetch a valid token
        before(() => {
            chai.request(app)
                .post("/api/auth")
                .send(user_credentials)
                .then(res => {
                    validToken = res.body.user.token;
                })
        })
    
        it('should return users movies collection', () => {
            const credentials = { token: validToken }
            return chai.request(app)
                .post(route)
                .send(credentials)
                .then(res => {
                    res.body.should.have.property('movies')
                })
        })*/

})



