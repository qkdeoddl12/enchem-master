var path = process.cwd();
var express = require('express');
var cors=require('cors')
var async=require('async')
var app = express();
var fs = require('fs');
var mAesCtr = require(path + '/lib/aes/AesCtr');
var bodyParser = require('body-parser');
var DB;
var mysql = require("mysql");  
var dateFormat = require('dateformat');
var base64 = require('base64-js');
var router = express.Router();
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
const excel = require('node-excel-export');
const crypto = require('crypto');
const aes256 = require('nodejs-aes256');
var moment = require('moment');
let xl = require('excel4node');



app.use(cors());
app.use(cookieParser());
//라우터 미들웨어 등록하는 구간에서는 라우터를 모두  등록한 이후에 다른 것을 세팅한다
//그렇지 않으면 순서상 라우터 이외에 다른것이 먼저 실행될 수 있다
app.use('/', router);       //라우트 미들웨어를 등록한다



app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public'));




var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "fmbdb12#$",
    database: "PLC",
    port:'3306'
});


app.listen(3030, function(){

    console.log("********   Service Running     127.0.0.1:3030 " +  now() +" ***********************");
con.connect(function(err) { if (err) { console.error('mysql connection error'); console.error(err); throw err; }else{ console.log("3030번 포트 연결에 성공하였습니다."); } });
});

//세션 환경 세팅
//세션은 서버쪽에 저장하는 것을 말하는데, 파일로 저장 할 수도 있고 레디스라고 하는 메모리DB등 다양한 저장소에 저장 할 수가 있는데
app.use(expressSession({
    secret: 'my key',           //이때의 옵션은 세션에 세이브 정보를 저장할때 할때 파일을 만들꺼냐
                                //아니면 미리 만들어 놓을꺼냐 등에 대한 옵션들임
    resave: true,
    saveUninitialized:true
}));


app.get('/', function (req, res) {
//    res.send('Hello World!');
   res.sendFile('index.html');
});


//사용자 로그인
app.post('/login', function (req, res) {
    console.log('/process/login 라우팅 함수호출 됨',req.body);
 
        var paramID = req.body.id || req.query.id;
        var pw = req.body.pw || req.query.pw;


        let login_query=`select count(*) as cnt,LEVEL from  tbl_user where ID='${paramID}' and PASSWORD='${pw}' and DELYN='N'`


        con.query(login_query, function(err,ress){
                    if(err) throw err;
                    console.log("### sended to ", now());

                        if(ress[0].cnt>0 ){

                            con.query(`INSERT INTO tbl_login_log (id,NAME,login_startTime) 
                 select ID,NAME,now() from tbl_user where ID='${paramID}'`, function(err,res){
                    if(err) throw err;
                    console.log("### SMS sended to ", now(),res);
                    


                });



                            if (req.session.user) {
                                console.log('이미 로그인 되어 있음');
                    
                                res.json({auth:true,level:ress[0].LEVEL})
                                
                    
                            } else {
                                req.session.user =
                                    {
                                        id: paramID,
                                        pw: pw,
                                        name: 'UsersNames!!!!!',
                                        authorized: true
                                    };
                            res.json({auth:true,level:ress[0].LEVEL})
                            }
                        }else{
                            res.json({auth:false,level:ress[0].LEVEL})
                        }
                });

 
        
});


//사용자 로그아웃
app.post('/logout', function (req, res) {
         var paramID = req.body.id || req.query.id;
     console.log('/process/loginout 라우팅 함수호출 됨');
        con.query(`INSERT INTO tbl_login_log (id,NAME,logout_endTime) 
                 select ID,NAME,now() from tbl_user where ID='${paramID}'`, function(err,res){
                    if(err) throw err;
                    console.log("### SMS sended to ", now(),res);
                    


                });
 
        if (req.session.user) {
            console.log('로그아웃 처리');
            req.session.destroy(
                function (err) {
                    if (err) {
                        console.log('세션 삭제시 에러');
                        return;
                    }
                    console.log('세션 삭제 성공');
                    //파일 지정시 제일 앞에 / 를 붙여야 root 즉 public 안에서부터 찾게 된다

                   
                    res.json({auth:false})
                }
            );          //세션정보 삭제
 
        } else {
            console.log('로긴 안되어 있음');
            res.json({auth:false})
        }
 
});
 

//모니터링보드 조회
app.post('/getMonitordata', function (request, response) {
    

    selectMonitor(con,function(ret){
        response.json(ret)
    })
    

});




//용기 데이터 조회
app.post('/getPOPdata', function (request, response) {
    
    var type=request.body.type ,
    text=request.body.text,
    date=request.body.date ;

    //console.log('server_data',request.body)

    selectsPOP(con,type,text,date,function(ret){
        response.json(ret)
    })
    

});


//시스템설정 데이터 
app.post('/getBoarddata', function (request, response) {
    
    var id=request.body.id;

    let board_data=[],userBoard_data=[];

    //console.log('server_data',request.body)


    async.waterfall(
    [
        callback => {
        // 첫번째 함수 수행
         selectSystem(con,id,function(ret){
                
                 callback(null,board_data.push(ret));
            })  
        },
        (arg1, callback) => {
        // 두번째 함수 수행

        selectSystem2(con,id,function(ret){
            
            callback(userBoard_data.push(ret));
        })
        
        }
    ],
    (err, result) => {
        // 결과 함수 수행
        if (err) {
        console.error(err);
        ;
        }
       return  response.json({board:board_data,user:userBoard_data})
    }
    );

});


//이력조회 데이터 
app.post('/getHistorydata', function (request, response) {
   
    var startDate=request.body.startDate;
    var endDate=request.body.endDate;
    var status=request.body.status;
    var loss=request.body.loss;
    var text=request.body.text;

    //console.log('server_data',request.body)


    selectHistory(con,startDate,endDate,status,loss,text,function(ret){
        response.json(ret)
    })

});


//이력조회 통계 
app.post('/getHistorydata_stats', function (request, response) {
   
    var startDate=request.body.startDate;
    var endDate=request.body.endDate;
    var status=request.body.status;
    var loss=request.body.loss;
    var text=request.body.text;

    //console.log('server_data',request.body)


    selectHistory_stats(con,startDate,endDate,status,loss,text,function(ret){
        response.json(ret)
    })

});


//입,출고 처리
app.post('/createPOPData', function (request, response) {

    var  barcode=request.body.barcode, 
    status=request.body.status;

    console.log(barcode,status)

    

    if(status=='O'){
        let out_query=`UPDATE drum_data set STATUS='${status}', OUT_TIME='${now()}' where BARCODE='${barcode}' and STATUS='I' and date(CREATETIME)=curdate()`
         con.query(out_query, function(err,res){
            if(err) throw err;
            console.log("### SMS sended to ", now(),res);
            if(res.affectedRows==1){
                 con.query(`INSERT INTO drum_data_log (IDX,BARCODE,STATUS,IN_TIME,OUT_TIME,LOSS,CREATETIME,CREATETIME_LOG,LOSS_CNT ) 
                 select IDX,BARCODE,STATUS,IN_TIME,OUT_TIME,LOSS,CREATETIME,now(),LOSS_CNT from drum_data where date(CREATETIME)=curdate() and BARCODE='${barcode}'`, function(err,res){
                    if(err) throw err;
                    console.log("### SMS sended to ", now(),res);
                    response.json({ret:true,msg:'출고로 변경되었습니다.'})


                });
               
            }else if(res.affectedRows==0){
                let out_query=`UPDATE drum_data set LOSS='F' where BARCODE='${barcode}' and STATUS='O' and LOSS='T' order by date(CREATETIME)=curdate() limit 1`
                con.query(out_query, function(err,res){
                   if(err) throw err;
                   console.log("### SMS sended to ", now(),res);
                   if(res.affectedRows==1){
                    con.query(`INSERT INTO drum_data_log (IDX,BARCODE,STATUS,IN_TIME,OUT_TIME,LOSS,CREATETIME,CREATETIME_LOG,LOSS_CNT ) 
                    select IDX,BARCODE,STATUS,IN_TIME,OUT_TIME,LOSS,CREATETIME,now(),LOSS_CNT from drum_data where date(CREATETIME)=curdate() and BARCODE='${barcode}'`, function(err,res){
                       if(err) throw err;
                       console.log("### SMS sended to ", now(),res);
                       response.json({ret:true,msg:'정상처리 되었습니다.'})
   
   
                   });
                   
                      
                   }else{
                       response.json({ret:false,msg:'정상처리변경이 실패되었습니다.'})
                   }
               });
            }else{
                response.json({ret:false,msg:'출고변경이 실패되었습니다.'})
            }
        });



    }else if(status=='I'){
        let check_query=`select count(*) as cnt from  drum_data where BARCODE='${barcode}' and date(CREATETIME)=curdate()`

con.query(check_query, function(err,res){
            if(err) throw err;
            console.log("### SMS sended to ", now(),res[0].cnt);
            if(res[0].cnt==0){
                let drum_Data_insert=[]

        var drum_data = { 'BARCODE' : barcode , 'STATUS' : status, 'CREATETIME' : now() }; 
        status=='I'? drum_data.IN_TIME=now():drum_data.OUT_TIME=now()
        
        drum_Data_insert.push(drum_data);
        con.query('INSERT INTO drum_data SET ?', drum_data, function(err,res){
            if(err) throw err;
            console.log("### SMS sended to ", now(),res.insertId);
            if(res.insertId!=''){
                drum_data.IDX=res.insertId
                drum_data.CREATETIME_LOG=now()
                drum_data.LOSS='F'

                con.query('INSERT INTO drum_data_log SET ?', drum_data, function(err,res){
            if(err) throw err;
            console.log("### SMS sended to ", now(),res);
            if(res.serverStatus==2){
                response.json({ret:true,msg:'입고처리되었습니다.'})
            }


        });
            }

        });
                
            }else{
                response.json({ret:false,msg:'중복되었습니다.'})
            }


        });



    }else if(status=='LOSS'){
        let loss_query=`UPDATE drum_data set LOSS='T',LOSS_CNT=LOSS_CNT+1, MODIFIEDTIME='${now()}' where BARCODE='${barcode}' and LOSS='F'  and date(CREATETIME)=curdate()`
         con.query(loss_query, function(err,res){
            if(err) throw err;
            console.log("### SMS sended to ", now(),res);
            if(res.affectedRows==1){
                
                 con.query(`INSERT INTO drum_data_log (IDX,BARCODE,STATUS,IN_TIME,OUT_TIME,LOSS,CREATETIME,CREATETIME_LOG,LOSS_CNT ) 
                 select IDX,BARCODE,STATUS,IN_TIME,OUT_TIME,LOSS,CREATETIME,now(),LOSS_CNT from drum_data where date(CREATETIME)=curdate() and BARCODE='${barcode}'`, function(err,res){
                    if(err) throw err;
                    console.log("### SMS sended to ", now(),res);
                    if(res.serverStatus==2){
                        response.json({ret:true,msg:'입고처리되었습니다.'})
                    }


                });
                
                response.json({ret:true,msg:'불량처리되었습니다.'})
            }else{
                response.json({ret:false,msg:'불량처리가 실패되었습니다.'})
            }
        });
    }else if(status=='1'||status=='2'){
        let loss_query=`UPDATE drum_data set STATUS='${status}', MODIFIEDTIME='${now()}' where BARCODE='${barcode}' and date(CREATETIME)=curdate()`
         con.query(loss_query, function(err,res){
            if(err) throw err;
      
            console.log("### SMS sended to ", now(),res);
            if(res.affectedRows==1){
                 con.query(`INSERT INTO drum_data_log (IDX,BARCODE,STATUS,IN_TIME,OUT_TIME,LOSS,CREATETIME,CREATETIME_LOG ) 
                 select IDX,BARCODE,STATUS,IN_TIME,OUT_TIME,LOSS,CREATETIME,now() from drum_data where date(CREATETIME)=curdate() and BARCODE='${barcode}'`, function(err,res){
            if(err) throw err;
            console.log("### SMS sended to ", now(),res);
            if(res.serverStatus==2){
                response.json({ret:true,msg:'입고처리되었습니다.'})
            }


        });
                response.json({ret:true,msg:`${status}차 세정처리되었습니다.`})
            }else{
                response.json({ret:false,msg:`${status}차 세정처리가 실패되었습니다.`})
            }
        });
    }



 

        

});


//데이터 삭제
app.post('/removePOPData', function (request, response) {

    let idx=request.body.idx;
    

    console.log(idx)

    

    let remove_query=`update drum_data set DELYN='Y',STATUS='D' where IDX='${idx}'`
         con.query(remove_query, function(err,res){
            if(err) throw err;
            console.log("### SMS sended to ", now(),res);
            if(res.affectedRows!=0){

                con.query(`INSERT INTO drum_data_log (IDX,BARCODE,STATUS,IN_TIME,OUT_TIME,LOSS,CREATETIME,CREATETIME_LOG )  
                        select IDX,BARCODE,STATUS,IN_TIME,OUT_TIME,LOSS,CREATETIME,NOW() from  drum_data where  IDX=${idx}`, function(err,res){
                            if(err) throw err;
                            console.log("### SMS sended to ", now(),res);
                            if(res.serverStatus==2){
                                response.json({ret:true,msg:`삭제처리되었습니다.`})
                            }else{
                                response.json({ret:true,msg:`삭제처리가 실패되었습니다.`})
                            }


                        });
                //response.json({ret:true,msg:'삭제처리 되었습니다.'})
            }else{
                //response.json({ret:false,msg:'삭제처리가 실패되었습니다.'})
            }
        });

 

        

});

//불량 관리
app.post('/mngLOSS', function (request, response) {

    let barcode=request.body.barcode,
    loss=request.body.loss,
    idx=request.body.idx,
    loss2='',
    loss_msg='',
    loss_query='';

    ;
    if(loss=='T'){
        loss2='F'
        loss_msg='정상'
    }else if(loss=='F'){
        loss2='T'
        loss_msg='불량'
        loss_query+=', LOSS_CNT=LOSS_CNT+1 '
    }
    
    

    console.log(barcode)

    

    let mngLoss_query=`update drum_data set LOSS='${loss2}' ${loss_query} where IDX=${idx}`
    console.log('mngLoss_query',mngLoss_query)
         con.query(mngLoss_query, function(err,res){
            if(err) throw response.json({ret:false,msg:`${loss_msg}처리가 실패되었습니다.`});
           // console.log("### SMS sended to ", now(),res);
            if(res.affectedRows!=0){
                 con.query(`INSERT INTO drum_data_log (IDX,BARCODE,STATUS,IN_TIME,OUT_TIME,LOSS,CREATETIME,CREATETIME_LOG,LOSS_CNT )  
                 select IDX,BARCODE,STATUS,IN_TIME,OUT_TIME,LOSS,CREATETIME,NOW(),LOSS_CNT from  drum_data where  IDX='${idx}'`, function(err,res){
                    if(err) throw err;
                    console.log("### SMS sended to ", now(),res);
                    if(res.serverStatus==2){
                    response.json({ret:true,msg:`${loss_msg}처리되었습니다.`})
                    }


                });
                        
                    }else{
                        response.json({ret:false,msg:`${loss_msg}처리가 실패되었습니다.`})
                    }
        });

});


//직압취소
app.post('/cancelData', function (request, response) {

    let barcode=request.body.barcode,
    status=request.body.status,
    idx=request.body.idx,
    status_ret='';
    

    
    switch(status){
        case 'O':
            status_ret='I'
            break;
    }
    
    

    console.log('cancelData',barcode,status,status_ret)

    

    let cancel_query=`update drum_data set STATUS='${status_ret}' where IDX='${idx}' and STATUS='${status}'`
         con.query(cancel_query, function(err,res){
            if(err) throw response.json({ret:false,msg:`처리가 실패되었습니다.`});
           // console.log("### SMS sended to ", now(),res);
            if(res.affectedRows!=0){
                console.log(`INSERT INTO drum_data_log (IDX,BARCODE,STATUS,IN_TIME,OUT_TIME,LOSS,CREATETIME,CREATETIME_LOG ) 
                 select IDX,BARCODE,STATUS,IN_TIME,OUT_TIME,LOSS,CREATETIME,now() from drum_data where IDX='${idx}' `)
                 con.query(`INSERT INTO drum_data_log (IDX,BARCODE,STATUS,IN_TIME,OUT_TIME,LOSS,CREATETIME,CREATETIME_LOG ) 
                 select IDX,BARCODE,STATUS,IN_TIME,OUT_TIME,LOSS,CREATETIME,now() from drum_data where IDX='${idx}' `, function(err,res){
                    if(err) throw err;

                    console.log("### SMS sended to ", now(),res);
                    if(res.serverStatus==2){
                        response.json({ret:true,msg:'작업취소 처리되었습니다.'})
                    }

                });
                        //response.json({ret:true,msg:`처리되었습니다.`})
                }else{
                        response.json({ret:false,msg:`처리가 실패되었습니다.`})
                }
        });

});



//사용자계정생성
app.post('/insertUser', function (request, response) {

    let id=request.body.id,
    pw=request.body.pw,
    name=request.body.name,
    phone=request.body.phone;


    let check_query=`select count(*) as cnt from  tbl_user where ID='${id}'`

con.query(check_query, function(err,res){
            if(err) throw err;
            console.log("### SMS sended to ", now(),res[0].cnt);

                if(res[0].cnt>0){
                    response.json({ret:true,msg:'이미 생성된 아이디입니다.'})
                }
        });
    

   

    

    

    var user_data = { 'ID' : id , 'PASSWORD' : pw, 'NAME' : name,'PHONE' : phone,'CREATETIME' : now() }; 
       
        console.log('insertUser',user_data)
        con.query('INSERT INTO tbl_user SET ?', user_data, function(err,res){
            if(err) throw response.json({ret:false,msg:'사용자계정 생성이 실패되었습니다.'});
            console.log("### insertUser ", now(),res);
           response.json({ret:true,msg:'사용자계정 생성되었습니다.'})
        });

});

//사용자계정 ID 중복체크
app.post('/checkID', function (request, response) {

    let id=request.body.id;
    


    let check_query=`select count(*) as cnt from  tbl_user where ID='${id}'`

con.query(check_query, function(err,res){
            if(err) throw err;
            console.log("### SMS sended to ", now(),res[0].cnt);

                if(res[0].cnt>0){
                    response.json({ret:false,msg:'이미 생성된 아이디입니다.'})
                }else{
                    response.json({ret:true,msg:'사용가능한 아이디입니다.'})
                }
        });



});





//근무자인원 체크
app.post('/checkWorker', function (request, response) {

  
    


    let check_worker_query=`select wIDX,day_worker, night_worker from tbl_worker_info where date(work_date)=curdate() order by work_date desc limit 1`

con.query(check_worker_query, function(err,res){
            if(err) throw err;
            //console.log("### SMS sended to ", now(),res[0]);

            response.json({ret:false,data:res})

            
        });



});


//근무자인원 저장
app.post('/saveWorker', function (request, response) {
    var wIDX=request.body.idx
    var cnt=request.body.cnt
    var type=request.body.type

    //근무자인원 수정
    if(wIDX!=''){
        console.log('work_info_data',work_info_data)
        let update_query=""

        if(type=='day'){
            update_query+='UPDATE tbl_worker_info SET work_date=?, day_worker=? where wIDX=?'
        }else{
            update_query+='UPDATE tbl_worker_info SET work_date=?, night_worker=? where wIDX=?'
        }
        con.query(update_query, 
                [now(),cnt,wIDX], function(err,res){
            if(err) throw err;
            console.log(err,res)
         
           response.json({ret:true,msg:'사용자계정 생성되었습니다.'})
        });

    }else{//근무자인원 추가
       //var work_info_data = { 'work_date' : now() , 'day_worker' : day_cnt, 'night_worker' : night_cnt }; 

        if(type=='day'){
            var work_info_data = { 'work_date' : now() , 'day_worker' : cnt }; 
        }else{
            var work_info_data = { 'work_date' : now() ,  'night_worker' : cnt }; 
        }
       
        console.log('work_info_data',work_info_data)
        con.query('INSERT INTO tbl_worker_info SET ?', work_info_data, function(err,res){
            if(err) throw response.json({ret:false,msg:'사용자계정 생성이 실패되었습니다.'});
         
           response.json({ret:true,msg:'사용자계정 생성되었습니다.'})
        });
        
    }
    

});


//시스템설정
app.post('/saveSystem', function (request, response) {

    let id=request.body.id,
    system=JSON.parse(request.body.system);

    console.log(id,system)


    async.waterfall(
    [
        callback => {
        // 첫번째 함수 수행
        let reset_query=`delete from tbl_user_board where ID='${id}'`
         con.query(reset_query, function(err,res){
            if(err) throw err;
                console.log('delete',res)
                callback(null,res)
        }); 
        },
        (arg1, callback) => {
        // 두번째 함수 수행
            console.log('arg1',arg1)
            let system_sql = "INSERT INTO tbl_user_board (boardIDX, ID) VALUES ?"; 
            con.query(system_sql, [system],function(err,res){
                if(err) throw err;
                console.log('INSERT',res)

                    callback(res)
            }); 
        }
    ],
    (err, result) => {
        // 결과 함수 수행
        if (err) {
         console.error('result',err,result);
        
        }
       return  response.json({ret:true})
    }
    );
    


    





});



//사용자 계정 조회
app.post('/getUserdata', function (request, response) {
    
    var text=request.body.text;

    //console.log('server_data',request.body)

    selectUser(con,text,function(ret){
        response.json(ret)
    })
    

});



//사용자 계정 삭제
app.post('/deleteUser', function (request, response) {

    let id=request.body.id;
    

    

    console.log('deleteUser',id)

    

    let cancel_query=`update tbl_user set DELYN='Y' where ID='${id}'`
         con.query(cancel_query, function(err,res){
            if(err) throw response.json({ret:false,msg:`처리가 실패되었습니다.`});
           // console.log("### SMS sended to ", now(),res);
            if(res.affectedRows!=0){
                
                        response.json({ret:true,msg:`처리되었습니다.`})
                }else{
                        response.json({ret:false,msg:`처리가 실패되었습니다.`})
                }
        });

});


//사용자 계정 수정
app.post('/editUser', function (request, response) {

    let id=request.body.id,
    pw=request.body.pw,
    name=request.body.name,
    phone=request.body.phone;



    console.log('editUser',id)

    

    let edit_query=`update tbl_user set PASSWORD='${pw}', NAME='${name}', PHONE='${phone}' where ID='${id}'`
    console.log('edit_query',edit_query)
         con.query(edit_query, function(err,res){
            if(err) throw response.json({ret:false,msg:`처리가 실패되었습니다.`});
           // console.log("### SMS sended to ", now(),res);
            if(res.affectedRows!=0){
                
                        response.json({ret:true,msg:`처리되었습니다.`})
                }else{
                        response.json({ret:false,msg:`처리가 실패되었습니다.`})
                }
        });

});


//용기 이력 엑셀 다운로드 
app.post('/downHistory', function (request, response) {

    var startDate=request.body.startDate;
    var endDate=request.body.endDate;
    var status=request.body.status;
    var loss=request.body.loss;
    var text=request.body.text;

    console.log('request.body',request.body)

    

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
     
         // Set value of cell B1 to 200 as a number type styled with paramaters of style
         ws.cell(1, 3)
         .string('상태')
         .style(style);
     
         // Set value of cell C1 to a formula styled with paramaters of style
         ws.cell(1, 4)
         .string('입고시간')
         .style(style);
     
         // Set value of cell A2 to 'string' styled with paramaters of style
         ws.cell(1, 5)
         .string('출고시간')
         .style(style);
    
        ws.cell(1, 6)
        .string('불량')
        .style(style);
        ws.cell(1, 7)
        .string('주간근무인원')
        .style(style);
        ws.cell(1, 8)
        .string('야간근무인원')
        .style(style);
     
         // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
        
         selectHistory_excel(con,startDate,endDate,status,loss,text,function(data){

            

        //console.log('data',data)
        data.forEach(function(item,index,arr2){

            if(item.STATUS=='I'){
                item.STATUS='입고'
             }else if(item.STATUS=='O'){
                item.STATUS='출고'
             }else if(item.STATUS=='D'){
                item.STATUS='삭제'
             }
       
            //console.log('rows',formatDate(new Date(item.IN_TIME)) 
            let cell_index=index+2
            ws.cell(cell_index, 1)
           .string(item.CREATETIME_LOG)
           .style(style);
         ws.cell(cell_index, 2)
           .string(item.BARCODE)
           .style(style);
     
         // Set value of cell B1 to 200 as a number type styled with paramaters of style
         ws.cell(cell_index, 3)
         .string(item.STATUS)
         .style(style);
     
         // Set value of cell C1 to a formula styled with paramaters of style
         ws.cell(cell_index, 4)
         .string(item.IN_TIME)
         .style(style);
     
         // Set value of cell A2 to 'string' styled with paramaters of style
         ws.cell(cell_index, 5)
         .string(item.OUT_TIME)
         .style(style);
    
        ws.cell(cell_index, 6)
        .string(item.CREATETIME)
        .style(style);
        ws.cell(cell_index, 7)
        .number(item.day_worker)
        .style(style);
        ws.cell(cell_index, 8)
        .number(item.night_worker)
        .style(style);
     
         
        })

        wb.write(`이력조회_${startDate} ~ ${endDate}_${now()}.xlsx`, response);



     })

     // Set value of cell A1 to 100 as a number type styled with paramaters of style
    
    
       
      // download

});




function selectHistory_excel(conn,startDate,endDate,status,loss,text,callback){



    var extQuery = `select IDX_LOG,BARCODE,STATUS,IN_TIME,OUT_TIME,LOSS,LOSS_CNT,LOSS_CNT,CREATETIME,CREATETIME_LOG,day_worker,night_worker from drum_data_log d
    LEFT JOIN tbl_worker_info w
    ON date(CREATETIME)=date(work_date)
     where 1=1` 

    

    if(startDate!=''&&endDate!=''){
        extQuery+=` and date(CREATETIME) between '${startDate}' and '${endDate}'`
    }

    if(status!=''){
        extQuery+=` and STATUS = '${status}'`
    }

    if(loss!=''){
        extQuery+=` and LOSS = '${loss}'`
    }

    if(text!=''){
        extQuery+=` and BARCODE = '${text}'`
    }


    

    extQuery+=` order by CREATETIME_LOG DESC`
    console.log(extQuery)


    conn.query(extQuery, function (err,rows){
        if(err){
            console.log("MySQL Query Execution Failed....");
            console.log(err);
            var fail_ret={itemsCount:0,data:[],status:'FAIL'}
           
            //return fail_ret;
        }
        //console.log('rows',rows)

        rows.forEach(function(item,index,arr2){
            //console.log('rows',formatDate(new Date(item.IN_TIME)) 
           
            //console.log(item)

            
            if(item.IN_TIME!==null){
                item.IN_TIME=formatDate(new Date(item.IN_TIME))
            }
            if(item.OUT_TIME!==null){
                item.OUT_TIME=formatDate(new Date(item.OUT_TIME))
            }
            if(item.CREATETIME!==null){
                item.CREATETIME=formatDate(new Date(item.CREATETIME))
            }

            if(item.CREATETIME_LOG!==null){
                item.CREATETIME_LOG=formatDate(new Date(item.CREATETIME_LOG))
            }
            
        })

    
        var ret=rows
        if(callback){
            callback(ret);
        }

       
        //return ret;
    });


}








function selectsPOP(conn,type,text,date,callback) {
    

    var extQuery = " select IDX,BARCODE,STATUS,IN_TIME,OUT_TIME,LOSS,CREATETIME  from drum_data where 1=1 and DELYN='N'" 

    if(type!=''&&type!==undefined){
        if(type=='LOSS'){
            extQuery+=` and LOSS='T'`
        }else{
            extQuery+=` and STATUS='${type}'`
        }
        
    }

    if(text!=''&&text!==undefined){
        extQuery+=` and BARCODE like'${text}%'`
    }


    switch(date){
        case 'day' :
            extQuery+=` and date(CREATETIME)=curdate()`
            break;
         case 'week' :
            extQuery+=` and date(CREATETIME) BETWEEN date(DATE_ADD(NOW(),INTERVAL -1 WEEK )) AND curdate()`
            break;
         case 'mon' :
            extQuery+=` and date(CREATETIME) BETWEEN date(DATE_ADD(NOW(),INTERVAL -1 MONTH )) AND curdate()`
            break;
         case 'year' :
            extQuery+=` and date(CREATETIME) BETWEEN date(DATE_ADD(NOW(),INTERVAL -1 YEAR )) AND curdate()`
            break;
    }

    extQuery+=` order by CREATETIME DESC`
    console.log(extQuery)


    conn.query(extQuery, function (err,rows){
        if(err){
            console.log("MySQL Query Execution Failed....");
            console.log(err);
            var fail_ret={itemsCount:0,data:[],status:'FAIL'}
            if(callback){
                callback(fail_ret);
            }
            return fail_ret;
        }
        

        rows.forEach(function(item,index,arr2){
            //console.log('rows',formatDate(new Date(item.IN_TIME)) )


            moment(item.CREATETIME).utcOffset(0, true).format('YYMMDDHHmmss')

            if(item.IN_TIME!==null){
                item.IN_TIME=formatDate(new Date(item.IN_TIME))
                //item.IN_TIME=moment(item.IN_TIME).tz('Asia/Seoul').format('YYYY-MM-DD hh:MM:ss');
                //item.IN_TIME=new Date(item.IN_TIME).toLocaleString("ko-KR", {timeZone: "Asia/Seoul"})
            }
            if(item.OUT_TIME!==null){
                item.OUT_TIME=formatDate(new Date(item.OUT_TIME))
            }
            if(item.CREATETIME!==null){
                item.CREATETIME=formatDate(new Date(item.CREATETIME))
            }
            
           
            //console.log(item)
        })
        var ret={itemsCount:rows.length,data:rows,status:'OK'}

        if(callback){
            callback(ret);
        }
        return ret;
    });

}


function selectUser(conn,text,callback) {
    

    var extQuery = " select ID,PASSWORD,NAME,PHONE,DELYN from tbl_user where 1=1" 

    

    if(text!=''&&text!==undefined){
        extQuery+=` and (ID like '%${text}%' || NAME like '%${text}%')`
    }


    

    extQuery+=` order by CREATETIME DESC`
    console.log(extQuery)


    conn.query(extQuery, function (err,rows){
        if(err){
            console.log("MySQL Query Execution Failed....");
            console.log(err);
            var fail_ret={itemsCount:0,data:[],status:'FAIL'}
            if(callback){
                callback(fail_ret);
            }
            return fail_ret;
        }
        //console.log('rows',rows)

        
        var ret={itemsCount:rows.length,data:rows,status:'OK'}

        if(callback){
            callback(ret);
        }
        return ret;
    });

}


function selectMonitor(conn,callback) {
    

    var extQuery = " select id,board_name,board_addr,board_sec from tbl_board where 1=1" 

    extQuery+=` order by id `
    console.log(extQuery)


    conn.query(extQuery, function (err,rows){
        if(err){
            console.log("MySQL Query Execution Failed....");
            console.log(err);
            var fail_ret={itemsCount:0,data:[],status:'FAIL'}
            if(callback){
                callback(fail_ret);
            }
            return fail_ret;
        }
        //console.log('rows',rows)

        
        var ret={itemsCount:rows.length,data:rows,status:'OK'}

        if(callback){
            callback(ret);
        }
        return ret;
    });

}




function selectSystem(conn,user,callback) {
    

    var boardQuery = " select id,board_name,board_addr,board_sec from tbl_board where 1=1" 


    console.log(boardQuery)


    
    let board_data=[];

    conn.query(boardQuery, function (err,rows){
        if(err){
            console.log("MySQL Query Execution Failed....");
            console.log(err); 
        }

        board_data.push(rows)
        console.log('boardQuery',rows)
        if(callback){
            callback(rows);
         }    
             

    
    });
    
    return board_data

   

   

}


function selectSystem2(conn,user,callback) {
    


    var userBoardQuery = " select ID,boardIDX from tbl_user_board where 1=1" 

    if(user!=''||user!='undefined'){
        userBoardQuery+=` and ID='${user}'`
    }

    console.log(userBoardQuery)

    let userBoard_data=[];

    conn.query(userBoardQuery, function (err,rows){
        if(err){
            console.log("MySQL Query Execution Failed....");
            console.log(err); 
        }

        userBoard_data.push(rows)
           console.log('userBoard_data',rows)
            if(callback){
        callback(rows);
    }        
    });

   
    


    return userBoard_data

}


function selectHistory(conn,startDate,endDate,status,loss,text,callback) {
    

    var extQuery = " select IDX_LOG,BARCODE,STATUS,IN_TIME,OUT_TIME,LOSS,LOSS_CNT,CREATETIME,CREATETIME_LOG from drum_data_log where 1=1" 

    

    if(startDate!=''&&endDate!=''){
        extQuery+=` and date(CREATETIME) between '${startDate}' and '${endDate}'`
    }

    if(status!=''){
        extQuery+=` and STATUS = '${status}'`
    }

    if(loss!=''){
        extQuery+=` and LOSS = '${loss}'`
    }

    if(text!=''){
        extQuery+=` and BARCODE = '${text}'`
    }


    

    extQuery+=` order by CREATETIME_LOG DESC`
    console.log(extQuery)


    conn.query(extQuery, function (err,rows){
        if(err){
            console.log("MySQL Query Execution Failed....");
            console.log(err);
            var fail_ret={itemsCount:0,data:[],status:'FAIL'}
            if(callback){
                callback(fail_ret);
            }
            return fail_ret;
        }
        //console.log('rows',rows)

         rows.forEach(function(item,index,arr2){

            if(item.IN_TIME!==null){
                item.IN_TIME=formatDate(new Date(item.IN_TIME))
            }
            if(item.OUT_TIME!==null){
                item.OUT_TIME=formatDate(new Date(item.OUT_TIME))
            }
            if(item.CREATETIME!==null){
                item.CREATETIME=formatDate(new Date(item.CREATETIME))
            }

            if(item.CREATETIME_LOG!==null){
                item.CREATETIME_LOG=formatDate(new Date(item.CREATETIME_LOG))
            }
            
           
            //console.log(item)
        })

        
        var ret={itemsCount:rows.length,data:rows,status:'OK'}

        if(callback){
            callback(ret);
        }
        return ret;
    });

}


function selectHistory_stats(conn,startDate,endDate,status,loss,text,callback) {
    

    var extQuery = `  SELECT BARCODE,COUNT(*) AS loss_cnt from drum_data_log where 1=1 AND LOSS='T'`

    

    if(startDate!=''&&endDate!=''){
        extQuery+=` and date(CREATETIME) between '${startDate}' and '${endDate}'`
    }

    if(status!=''){
        extQuery+=` and STATUS = '${status}'`
    }

    if(loss!=''){
        extQuery+=` and LOSS = '${loss}'`
    }

    if(text!=''){
        extQuery+=` and BARCODE = '${text}'`
    }


    

    extQuery+=` GROUP BY BARCODE ORDER BY count(*) desc`
    console.log(extQuery)


    conn.query(extQuery, function (err,rows){
        if(err){
            console.log("MySQL Query Execution Failed....");
            console.log(err);
            var fail_ret={itemsCount:0,data:[],status:'FAIL'}
            if(callback){
                callback(fail_ret);
            }
            return fail_ret;
        }
        //console.log('rows',rows)

         rows.forEach(function(item,index,arr2){

            if(item.IN_TIME!==null){
                item.IN_TIME=formatDate(new Date(item.IN_TIME))
            }
            if(item.OUT_TIME!==null){
                item.OUT_TIME=formatDate(new Date(item.OUT_TIME))
            }
            if(item.CREATETIME!==null){
                item.CREATETIME=formatDate(new Date(item.CREATETIME))
            }

            if(item.CREATETIME_LOG!==null){
                item.CREATETIME_LOG=formatDate(new Date(item.CREATETIME_LOG))
            }
            
           
            //console.log(item)
        })

        
        var ret={itemsCount:rows.length,data:rows,status:'OK'}

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


function encrypt(str){
    return mAesCtr.encrypt(str,'goodus..',256);
}

function decrypt(str){
    if(!str || str==""){
        return "";
    }
    return mAesCtr.decrypt(str,'goodus..',256);
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






