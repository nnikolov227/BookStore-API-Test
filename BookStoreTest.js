import { it } from 'mocha';
import supertest from 'supertest';
import {expect} from 'chai';
const request = supertest("https://demoqa.com/");
var TOKEN = '27289901';

//1. Да се напишат тестове за различните видове възможни грешки при създаване на нов потребител. Всяка грешка да се валидира.
describe ('Account Negative Tests',() => { 
    it('POST Account Without Username', () =>{
        
        const AccountNumber = Math.floor(Math.random() * 999);
        const data = {
            userName: '',
            password: `Nikol@ytest${AccountNumber}`,
        };

        return request.post('Account/v1/User')
        .set('Accept', 'application/json')
        .set('Authorization',`Basic bmlrOTk6OTluaWs=,${TOKEN}`)
        .send(data)
        .then((res)=>{
            expect(res.statusCode).to.not.equal('201');
        });
    });

    it('POST Account Without Password', () =>{
        
        const AccountNumber = Math.floor(Math.random() * 999);
        const data = {
            userName: 'TestUser',
            password: '',
        };

        return request.post('Account/v1/User')
        .set('Accept', 'application/json')
        .set('Authorization',`Basic bmlrOTk6OTluaWs=,${TOKEN}`)
        .send(data)
        .then((res)=>{
            expect(res.statusCode).to.not.equal('201');
        });
    });

    it('POST Account Without Username and Password', () =>{
        
        const AccountNumber = Math.floor(Math.random() * 999);
        const data = {
            userName: '',
            password: '',
        };

        return request.post('Account/v1/User')
        .set('Accept', 'application/json')
        .set('Authorization',`Basic bmlrOTk6OTluaWs=,${TOKEN}`)
        .send(data)
        .then((res)=>{
            expect(res.statusCode).to.not.equal('201');
        });
    });

    it('POST Account With Username and short Password', () =>{
        
        const AccountNumber = Math.floor(Math.random() * 999);
        const data = {
            userName: 'User123',
            password: '123',
        };

        return request.post('Account/v1/User')
        .set('Accept', 'application/json')
        .set('Authorization',`Basic bmlrOTk6OTluaWs=,${TOKEN}`)
        .send(data)
        .then((res)=>{
            expect(res.statusCode).to.not.equal('201');
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------------------

//2. Да се създаде нов потребител и да се валидира, че е създаден. ---------------------------------------------------------------
const AccountNumber = Math.floor(Math.random() * 999);
        const data = {
            userName: `nikolaytest${AccountNumber}`,
            password: `Nikol@ytest${AccountNumber}`,
        };

        var UserID;
describe ('Account Creation Test',() => { 
    it('POST Account', () =>{
        return request.post('Account/v1/User')
        .set('Accept', 'application/json')
        .set('Authorization',`Basic bmlrOTk6OTluaWs=,${TOKEN}`)
        .send(data)
        .then((res)=>{
            expect(res.body.username).to.eq(data.userName);
            UserID=res.body.userID;
        });
    });

    it('Check Account Exists', () =>{
        return request.post('Account/v1/User')
        .set('Accept', 'application/json')
        .set('Authorization',`Basic bmlrOTk6OTluaWs=,${TOKEN}`)
        .send(data)
        .then((res)=>{
            expect(res.statusCode).to.not.equal('201');
        });
    });
    
    it('POST Authorized Account', () =>{
        return request.post('Account/v1/Authorized')
        .set('Accept', 'application/json')
        .set('Authorization',`Basic bmlrOTk6OTluaWs=,${TOKEN}`)
        .send(data)
        .then((res)=>{
            expect(res.statusCode).to.eq(200);
        });
    });

    it('POST Generate Token', () =>{
        return request.post('Account/v1/GenerateToken')
        .set('Accept', 'application/json')
        .set('Authorization',`Basic bmlrOTk6OTluaWs=,${TOKEN}`)
        .send(data)
        .then((res)=>{
            expect(res.statusCode).to.eq(200);
            TOKEN=res.body.token;
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------------------

//3. От списъка с всички книги, да се избере една и да се добави към предпочитаните книги (колекция). Да се валидира, че книгата е
//добавена.
describe ('Add Book to Wishlist',() => { 
    it('POST Book to Wishlist',  () =>{
        const dataBook = {
            userId: `${UserID}`,
            collectionOfIsbns :[
                '9781593277574'
                ],
        };
        return request.post('BookStore/v1/Books')
        .set('Accept', 'application/json')
        .set('Authorization',`${TOKEN}`)
        .send(dataBook)
        .then((res)=>{
        expect(res.body).to.not.be.empty;
        });
    });
//--------------------------------------------------------------------------------------------------------------------------------

//4. Към списъка с предпочитаните книги (колекция) да се добави книга с несъществуващ номер (isbn). Да се валидира грешката.
    it('POST Book wrong ISBN to Wishlist', () =>{
        const dataBook = {
            userId: `${UserID}`,
            collectionOfIsbns :[
                '000',
                ],
        };
         return request.post('BookStore/v1/Books')
        .set('Accept', 'application/json')
        .set('Authorization',`${TOKEN}`)
        .send(dataBook)
        .then((res)=>{
        expect(res.statusCode).to.not.equal(201);
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------------------

//5. От списъка с всички книги, да се избере друга книга, която да замени първата в списъка с предпочитаните книги (колекция). 
//Да се валидира,че книгата е сменена.
describe ('Replace Book',() => { 
    it('PUT Book', () =>{
        const dataBook = {
            userId: `${UserID}`,
            isbn :'9781491904244',
        };
        return request.put('BookStore/v1/Books/9781593277574')
        .set('Accept', 'application/json')
        .set('Authorization',`${TOKEN}`)
        .send(dataBook)
        .then((res)=>{
        console.log(res.body);
        expect(res.statusCode).to.eq(200);
        });
    });

});
//--------------------------------------------------------------------------------------------------------------------------------

//6. Да се валидира, че книга с номер (isbn) 9781491904244 има 278 страници.------------------------------------------------------
describe ('Book Pages',() => {
    it('Validate Pages of Book with ISBN',() =>{
      request.get('BookStore/v1/Book?ISBN=9781491904244')
      .set('Accept', 'application/json')
      .set('Authorization',`Basic bmlrOTk6OTluaWs=,${TOKEN}`)
      .end((err,res) =>
        {
         expect(res.body.pages).to.be.eq(278);
        });
    });
})
//--------------------------------------------------------------------------------------------------------------------------------

//7. Да се премахне книгата от списъка с предпочитаните книги (колекция). Да се валидира, че книгата е премахната.
describe ('Delete Book',() => { 
    it('Delete Book', () =>{
        const dataBook = {
            isbn :'9781491904244',
            userId: `${UserID}`,
        };
        return request.delete('BookStore/v1/Book')
        .set('Accept', 'application/json')
        .set('Authorization',`${TOKEN}`)
        .send(dataBook)
        .then((res)=>{
        console.log(res.body);
        expect(res.statusCode).to.eq(204);
        });
    });
//--------------------------------------------------------------------------------------------------------------------------------

//8. От списъка с предпочитаните книги (колекция), да се премахне книга, която не е добавена към него. Да се валидира грешката.

    it('Delete Wrong ISBN Book', () =>{
        const dataBook = {
            isbn :'000',
            userId: `${UserID}`,
        };
        return request.delete('BookStore/v1/Book')
        .set('Accept', 'application/json')
        .set('Authorization',`${TOKEN}`)
        .send(dataBook)
        .then((res)=>{
        console.log(res.body);
        expect(res.statusCode).to.eq(204);
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------------------
