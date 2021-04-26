var path = process.cwd();
var express = require('express');
var cors=require('cors')
var async=require('async')
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var DB;
var mysql = require("mysql");  
var dateFormat = require('dateformat');
var router = express.Router();
var moment = require('moment');
let xl = require('excel4node');



app.use(cors());

//라우터 미들웨어 등록하는 구간에서는 라우터를 모두  등록한 이후에 다른 것을 세팅한다
//그렇지 않으면 순서상 라우터 이외에 다른것이 먼저 실행될 수 있다
app.use('/', router);       //라우트 미들웨어를 등록한다



app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public'));




var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "fmbdb12#$",
    database: "corechips_opc",
    port:'3307'
});


app.listen(3050, function(){

    console.log("********   Service Running     127.0.0.1:3050 " +  now() +" ***********************");
con.connect(function(err) { if (err) { console.error('mysql connection error'); console.error(err); throw err; }else{ console.log("3030번 포트 연결에 성공하였습니다."); } });
});







//엑셀 주간 생산 다운로드
app.get('/prodExcel_week', function (request, response) {

    var ymd = request.body.date || request.query.date;
    console.log('ymd',ymd)

    

     // Create a new instance of a Workbook class
     var wb = new xl.Workbook();

     // Add Worksheets to the workbook
     var ws = wb.addWorksheet('Sheet 1');
     //var ws2 = wb.addWorksheet('Sheet 2');
 
     // Create a reusable style
     var style = wb.createStyle({
       font: {
         color: '#000000',
         size: 12,
       }
       // ,numberFormat: '$#,##0.00; ($#,##0.00); -',
     });

     ws.cell(1, 1)
           .string('작업자')
           .style(style);
         ws.cell(1, 2)
           .string('공정')
           .style(style);
     
         // Set value of cell B1 to 200 as a number type styled with paramaters of style
         ws.cell(1, 3)
         .string('제품명')
         .style(style);
     
         // Set value of cell C1 to a formula styled with paramaters of style
         ws.cell(1, 4)
         .string('생산수')
         .style(style);
     
         // Set value of cell A2 to 'string' styled with paramaters of style
         ws.cell(1, 5)
         .string('불량수')
         .style(style);
    
        ws.cell(1, 6)
        .string('불량율')
        .style(style);
     
         // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
         ws.cell(1, 7)
         .string('작업공정시간')
         .style(style);

         selectProddata_excel(con,ymd,'W',function(data){
       

        //console.log('data',data)
        data.forEach(function(item,index,arr2){
            //console.log('rows',formatDate(new Date(item.IN_TIME)) 
            let cell_index=index+2
            ws.cell(cell_index, 1)
           .string(item.TRAN_USER_ID)
           .style(style);
         ws.cell(cell_index, 2)
           .string(item.oName)
           .style(style);
     
         // Set value of cell B1 to 200 as a number type styled with paramaters of style
         ws.cell(cell_index, 3)
         .string(item.MAT_NAME)
         .style(style);
     
         // Set value of cell C1 to a formula styled with paramaters of style
         ws.cell(cell_index, 4)
         .number(item.QTY)
         .style(style);
     
         // Set value of cell A2 to 'string' styled with paramaters of style
         ws.cell(cell_index, 5)
         .number(item.LOSS_QTY)
         .style(style);
    
        ws.cell(cell_index, 6)
        .string(item.per)
        .style(style);
     
         // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
         ws.cell(cell_index, 7)
         .string(item.worktime)
         .style(style);
            //console.log(item)
        })

        wb.write(`주간생산실적_${ymd}_${now()}.xlsx`, response);



     })

     // Set value of cell A1 to 100 as a number type styled with paramaters of style
    
    
       
      // download

});



//엑셀 월간 생산 다운로드
app.get('/prodExcel_month', function (request, response) {

    var ymd = request.body.date || request.query.date;
    console.log('ymd',ymd)

    

     // Create a new instance of a Workbook class
     var wb = new xl.Workbook();

     // Add Worksheets to the workbook
     var ws = wb.addWorksheet('Sheet 1');
     //var ws2 = wb.addWorksheet('Sheet 2');
 
     // Create a reusable style
     var style = wb.createStyle({
       font: {
         color: '#000000',
         size: 12,
       }
       // ,numberFormat: '$#,##0.00; ($#,##0.00); -',
     });

     ws.cell(1, 1)
           .string('작업자')
           .style(style);
         ws.cell(1, 2)
           .string('공정')
           .style(style);
     
         // Set value of cell B1 to 200 as a number type styled with paramaters of style
         ws.cell(1, 3)
         .string('제품명')
         .style(style);
     
         // Set value of cell C1 to a formula styled with paramaters of style
         ws.cell(1, 4)
         .string('생산수')
         .style(style);
     
         // Set value of cell A2 to 'string' styled with paramaters of style
         ws.cell(1, 5)
         .string('불량수')
         .style(style);
    
        ws.cell(1, 6)
        .string('불량율')
        .style(style);
     
         // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
         ws.cell(1, 7)
         .string('작업공정시간')
         .style(style);

         selectProddata_excel(con,ymd,'M',function(data){
       

        //console.log('data',data)
        data.forEach(function(item,index,arr2){
            //console.log('rows',formatDate(new Date(item.IN_TIME)) 
            let cell_index=index+2
            ws.cell(cell_index, 1)
           .string(item.TRAN_USER_ID)
           .style(style);
         ws.cell(cell_index, 2)
           .string(item.oName)
           .style(style);
     
         // Set value of cell B1 to 200 as a number type styled with paramaters of style
         ws.cell(cell_index, 3)
         .string(item.MAT_NAME)
         .style(style);
     
         // Set value of cell C1 to a formula styled with paramaters of style
         ws.cell(cell_index, 4)
         .number(item.QTY)
         .style(style);
     
         // Set value of cell A2 to 'string' styled with paramaters of style
         ws.cell(cell_index, 5)
         .number(item.LOSS_QTY)
         .style(style);
    
        ws.cell(cell_index, 6)
        .string(item.per)
        .style(style);
     
         // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
         ws.cell(cell_index, 7)
         .string(item.worktime)
         .style(style);
            //console.log(item)
        })

        wb.write(`월간생산실적_${ymd}_${now()}.xlsx`, response);

     })

     

     
     
     // Set value of cell A1 to 100 as a number type styled with paramaters of style
    
    
       
      // download

});






//엑셀 주간 자재 다운로드
app.get('/stockExcel_week', function (request, response) {

    var ymd = request.body.date || request.query.date;
    console.log('ymd',ymd)

    

     // Create a new instance of a Workbook class
     var wb = new xl.Workbook();

     // Add Worksheets to the workbook
     var ws = wb.addWorksheet('Sheet 1');
     //var ws2 = wb.addWorksheet('Sheet 2');
 
     // Create a reusable style
     var style = wb.createStyle({
       font: {
         color: '#000000',
         size: 12,
       }
       // ,numberFormat: '$#,##0.00; ($#,##0.00); -',
     });

     ws.cell(1, 1)
           .string('자재명')
           .style(style);
         ws.cell(1, 2)
           .string('자재타입')
           .style(style);
     
         // Set value of cell B1 to 200 as a number type styled with paramaters of style
         ws.cell(1, 3)
         .string('입고')
         .style(style);
     
         // Set value of cell C1 to a formula styled with paramaters of style
         ws.cell(1, 4)
         .string('출고')
         .style(style);
     
         // Set value of cell A2 to 'string' styled with paramaters of style
         ws.cell(1, 5)
         .string('재고')
         .style(style);
    

         selectStockdata_excel(con,ymd,'W',function(data){
       

        //console.log('data',data)
        data.forEach(function(item,index,arr2){
            //console.log('rows',formatDate(new Date(item.IN_TIME)) 
            let cell_index=index+2
            ws.cell(cell_index, 1)
           .string(item.MAT_NAME)
           .style(style);
         ws.cell(cell_index, 2)
           .string(item.SHIP_TYPE)
           .style(style);
     
         // Set value of cell B1 to 200 as a number type styled with paramaters of style
         ws.cell(cell_index, 3)
         .number(item.in_cnt)
         .style(style);
     
         // Set value of cell C1 to a formula styled with paramaters of style
         ws.cell(cell_index, 4)
         .number(item.out_cnt)
         .style(style);
     
         // Set value of cell A2 to 'string' styled with paramaters of style
         ws.cell(cell_index, 5)
         .number(item.stock)
         .style(style);
    
        })

        wb.write(`주간자재현황_${ymd}_${now()}.xlsx`, response);



     })

     

     
     
     // Set value of cell A1 to 100 as a number type styled with paramaters of style
    
    
       
      // download

});



//엑셀 월간 자재 다운로드
app.get('/stockExcel_month', function (request, response) {

    var ymd = request.body.date || request.query.date;
    console.log('ymd',ymd)

    

     // Create a new instance of a Workbook class
     var wb = new xl.Workbook();

     // Add Worksheets to the workbook
     var ws = wb.addWorksheet('Sheet 1');
     //var ws2 = wb.addWorksheet('Sheet 2');
 
     // Create a reusable style
     var style = wb.createStyle({
       font: {
         color: '#000000',
         size: 12,
       }
       // ,numberFormat: '$#,##0.00; ($#,##0.00); -',
     });

     ws.cell(1, 1)
           .string('생성일자')
           .style(style);
         ws.cell(1, 2)
           .string('용기번호')
           .style(style);
     
         ws.cell(1, 3)
         .string('상태')
         .style(style);
     
         ws.cell(1, 4)
         .string('입고시간')
         .style(style);
     
         ws.cell(1, 5)
         .string('출고시간')
         .style(style);
         ws.cell(1, 6)
         .string('불량')
         .style(style);

         selectHistory(con,startDate,endDate,status,loss,text,function(data){
           //console.log('data',data)
        data.forEach(function(item,index,arr2){
          //console.log('rows',formatDate(new Date(item.IN_TIME)) 
          let cell_index=index+2
          ws.cell(cell_index, 1)
         .string(item.MAT_NAME)
         .style(style);
       ws.cell(cell_index, 2)
         .string(item.SHIP_TYPE)
         .style(style);
   
       // Set value of cell B1 to 200 as a number type styled with paramaters of style
       ws.cell(cell_index, 3)
       .number(item.in_cnt)
       .style(style);
   
       // Set value of cell C1 to a formula styled with paramaters of style
       ws.cell(cell_index, 4)
       .number(item.out_cnt)
       .style(style);
   
       // Set value of cell A2 to 'string' styled with paramaters of style
       ws.cell(cell_index, 5)
       .number(item.stock)
       .style(style);
      })
      })

         selectStockdata_excel(con,ymd,'M',function(data){
       

       

        wb.write(`월간자재현황_${ymd}_${now()}.xlsx`, response);



     })

});



 



function selectProddata_excel(conn,ymd,type,callback){

    let day_Query="";
    if(type=='W'){
        day_Query = `select TRAN_USER_ID,ifnull(oName,'') as oName,MAT_NAME,QTY,LOSS_QTY,concat(round(ifnull(LOSS_QTY/QTY*100,0)),'%') as per,SEC_TO_TIME(sum(TIME_TO_SEC( OPER_TIME))) as worktime from mfmblothis m
    left join oper_code o
    on o.oCode=m.OPER
    where 1=1 and OPER not in ('INV001','SHP001') and TRAN_USER_ID <> '' and date(TRAN_TIME) between date('${ymd}') and DATE_ADD(date('${ymd}'),INTERVAL 7 day)
    group by TRAN_USER_ID,OPER,MAT_NAME` 
    }else if(type=='M'){
        day_Query = `select TRAN_USER_ID,ifnull(oName,'') as oName,MAT_NAME,QTY,LOSS_QTY,concat(round(ifnull(LOSS_QTY/QTY*100,0)),'%') as per,SEC_TO_TIME(sum(TIME_TO_SEC( OPER_TIME))) as worktime from mfmblothis m
    left join oper_code o
    on o.oCode=m.OPER
    where 1=1 and OPER not in ('INV001','SHP001') and TRAN_USER_ID <> '' and DATE_FORMAT(date(TRAN_TIME), '%Y-%m') = '${ymd.substr(0,4)+'-'+ymd.substr(4,2)}'
    group by TRAN_USER_ID,OPER,MAT_NAME` 

    }
   



    

    
    console.log(day_Query)


    conn.query(day_Query, function (err,rows){
        if(err){
            console.log("MySQL Query Execution Failed....");
            console.log(err);
            var fail_ret={itemsCount:0,data:[],status:'FAIL'}
           
            return fail_ret;
        }
        //console.log('rows',rows)

        rows.forEach(function(item,index,arr2){
            //console.log('rows',formatDate(new Date(item.IN_TIME)) 
           
            //console.log(item)
        })

    
        var ret=rows
        if(callback){
            callback(ret);
        }

       
        return ret;
    });


}





function selectStockdata_excel(conn,ymd,type,callback){

    let day_Query="";
    if(type=='W'){
        day_Query = `   SELECT MAT_NAME,SHIP_TYPE,in_cnt,out_cnt,(in_cnt-out_cnt) AS stock
        FROM     (SELECT MAT_NAME,SHIP_TYPE,SUM(if(OPER='INV001',QTY,0)) AS in_cnt,SUM(if(OPER='SHP001',QTY,0)) AS OUT_cnt FROM mfmblothis
            WHERE OPER in ('INV001','SHP001') and date(TRAN_TIME) between date('${ymd}') and DATE_ADD(date('${ymd}'),INTERVAL 7 day)
            GROUP BY MAT_NAME,SHIP_TYPE) cnt` 
    }else if(type=='M'){
        day_Query = `   SELECT MAT_NAME,SHIP_TYPE,in_cnt,out_cnt,(in_cnt-out_cnt) AS stock
        FROM     (SELECT MAT_NAME,SHIP_TYPE,SUM(if(OPER='INV001',QTY,0)) AS in_cnt,SUM(if(OPER='SHP001',QTY,0)) AS OUT_cnt FROM mfmblothis
            WHERE OPER in ('INV001','SHP001')  and DATE_FORMAT(date(TRAN_TIME), '%Y-%m') = '${ymd.substr(0,4)+'-'+ymd.substr(4,2)}'
            GROUP BY MAT_NAME,SHIP_TYPE) cnt` 

    }
   



    

    
    console.log(day_Query)


    conn.query(day_Query, function (err,rows){
        if(err){
            console.log("MySQL Query Execution Failed....");
            console.log(err);
            var fail_ret={itemsCount:0,data:[],status:'FAIL'}
           
            return fail_ret;
        }
        //console.log('rows',rows)

        rows.forEach(function(item,index,arr2){
            //console.log('rows',formatDate(new Date(item.IN_TIME)) 
           
            //console.log(item)
        })

    
        var ret=rows
        if(callback){
            callback(ret);
        }

       
        return ret;
    });


}




                                                                                                                                                                                                                                                               

function checkUndefined(t) {
  if (t === undefined) {
    return '';
  }
  return t;
}

                                                                          
var now = function() {
    var date = new Date();
    var m = date.getMonth()+1;
    var d = date.getDate();
    var h = date.getHours();
    var i = date.getMinutes();
    var s = date.getSeconds();
    var get_date = date.getFullYear()+'-'+(m>9?m:'0'+m)+'-'+(d>9?d:'0'+d)+' '+(h>9?h:'0'+h)+':'+(i>9?i:'0'+i)+':'+(s>9?s:'0'+s);

    return get_date;
}



function formatDate(date) {


    return `${date.getFullYear()}-${lpad((date.getMonth() + 1),2,'0')}-${lpad(date.getDate(),2,'0')} ${lpad(date.getHours(),2,'0')}:${lpad(date.getMinutes(),2,'0')}:${lpad(date.getSeconds(),2,'0')}`
}

function formatDate2(date) {


    return `${date.getFullYear()}-${lpad((date.getMonth() + 1),2,'0')}-${lpad(date.getDate(),2,'0')}`
}


function lpad(str, padLen, padStr) {
    if (padStr.length > padLen) {
        console.log("오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다");
        return str;
    }
    str += ""; // 문자로
    padStr += ""; // 문자로
    while (str.length < padLen) 
        str = padStr + str;
    str = str.length >= padLen
        ? str.substring(0, padLen)
        : str;
    return str;
}





