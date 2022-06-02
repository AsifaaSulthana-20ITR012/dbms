const express=require('express')
const bodyParser=require('body-parser')
const mysql=require('mysql')
const nodemon = require('nodemon')

const app=express()
const port=process.env.PORT || 5000

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json())
//mysql

const pool=mysql.createPool({
    connectionLimit:10,
    host           :'localhost',
    user           :'root',
    password       :'',
    database       :'dbms_project'

});

//get all haal details in database
app.get('',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)
        connection.query('select * from hall_booking',(err,rows) => {
            connection.release()//return the connection to pool

             if(!err){
                 res.send(rows)
             }else{
                 console.log(err)
             }
        })
    })
})


//get deatils of hall bt id in database
app.get('/:booking_id',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        connection.query('select * from hall_booking where booking_id = ?',[req.params.booking_id],(err,rows) => {
            connection.release()//return the connection to pool

             if(!err){
                 res.send(rows)
             }else{
                 console.log(err)
             }
        })
    })
})


//delete a record
app.delete('/:booking_id',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        connection.query('delete from hall_booking where booking_id= ?',[req.params.booking_id],(err,rows) => {
            connection.release()//return the connection to pool

             if(!err){
                 res.send(`record has been deleted with id ${[req.params.booking_id]} has been removed`)
             }else{
                 console.log('The data from hall_booking are:\n',rows)
             }
        })
    })
})


//add a record
app.post('',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err

        const params=req.body

        connection.query('insert into hall_booking set ?',params,(err,rows) => {
            connection.release()//return the connection to pool

             if(!err){
                 res.send(`hall details has been added with id:${params.booking_id} has been added`)
             }else{
                 console.log(err)
             }
        })
        console.log(req.body)
    })
})


app.put('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const {booking_id,hall_name,hall_id,function_name,date_of_booking,event_date } = req.body

        connection.query('UPDATE hall_booking SET hall_name = ?, hall_id = ?, function_name = ?, date_of_booking = ?,event_date=? WHERE booking_id = ?', [hall_name,hall_id,function_name,date_of_booking,event_date,booking_id] , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`hall with the number: ${booking_id}} has been updated.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})


//listen on environment port 50000
app.listen(port,()=>console.log(`Listen on port ${port}`))