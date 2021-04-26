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


app.listen(3050, function(){

    console.log("********   Service Running     127.0.0.1:3050 " +  now() +" ***********************");
con.connect(function(err) { if (err) { console.error('mysql connection error'); console.error(err); throw err; }else{ console.log("3030번 포트 연결에 성공하였습니다."); } });
});





//일일데이터 
app.post('/getDaydata', function (request, response) {
    

    async.waterfall(
    [
        callback => {
        // 첫번째 함수 수행
        selectDailydata_diff(con,function(ret){
                
                 callback(null,ret);
            })  
        }
    ],
    (err, result) => {
        // 결과 함수 수행
        if (err) {
        console.error(err);
        }
        //console.log('getDaydata',result)
       return  response.send(result)
    }
    );

});

//일일 PLC 데이터
app.post('/getDayPlcdata', function (request, response) {
    

    async.waterfall(
    [
        callback => {
        // 첫번째 함수 수행
        selectDailydata_plc(con,function(ret){
                
                 callback(null,ret);
            })  
        }
    ],
    (err, result) => {
        // 결과 함수 수행
        if (err) {
        console.error(err);
        }
        //console.log('getDayPlcdata',result)
       return  response.send(result)
    }
    );

});

//주간데이터 
app.post('/getWeeklydata', function (request, response) {
    

    async.waterfall(
    [
        callback => {
        // 첫번째 함수 수행
        selectWeeklydata_diff(con,function(ret){
                
                 callback(null,ret);
            })  
        }
    ],
    (err, result) => {
        // 결과 함수 수행
        if (err) {
        console.error(err);
        }
        //console.log('getDaydata',result)
       return  response.send(result)
    }
    );

});

//주간 PLC 데이터
app.post('/getWeeklyPlcdata', function (request, response) {
    

    async.waterfall(
    [
        callback => {
        // 첫번째 함수 수행
        selectWeeklydata_plc(con,function(ret){
                
                 callback(null,ret);
            })  
        }
    ],
    (err, result) => {
        // 결과 함수 수행
        if (err) {
        console.error(err);
        }
        //console.log('getDayPlcdata',result)
       return  response.send(result)
    }
    );

});

//월간데이터 
app.post('/getMonthlydata', function (request, response) {
    

    async.waterfall(
    [
        callback => {
        // 첫번째 함수 수행
        selectMonthlydata_diff(con,function(ret){
                
                 callback(null,ret);
            })  
        }
    ],
    (err, result) => {
        // 결과 함수 수행
        if (err) {
        console.error(err);
        }
        //console.log('getDaydata',result)
       return  response.send(result)
    }
    );

});

//월간 PLC 데이터
app.post('/getMonthlyPlcdata', function (request, response) {

  
    

    async.waterfall(
    [
        callback => {
        // 첫번째 함수 수행
        selectMonthlydata_plc(con,function(ret){
                
                 callback(null,ret);
            })  
        }
    ],
    (err, result) => {
        // 결과 함수 수행
        if (err) {
        console.error(err);
        }
        //console.log('getDayPlcdata',result)
       return  response.send(result)
    }
    );

});



//설비별 가동데이터_월별
app.post('/getMonthlyEquipdata', function (request, response) {
    
      let equip_data=[],man_data=[],summary_data=[];

    async.waterfall(
    [
        callback => {
        // 첫번째 함수 수행
        selectMonthlydata_equip(con,function(ret){
                
                 callback(null,equip_data.push(ret.data));
            })  
        },
        (arg1, callback) => {
        // 두번째 함수 수행

        selectMonthlydata_man(con,function(ret){
            
            callback(null,man_data.push(ret.data));
        })
        
        },
        (arg1, callback) => {
        // 두번째 함수 수행

        selectMonthlydata_summary(con,function(ret){
            
            callback(summary_data.push(ret.data));
        })
        
        }
    ],
    (err, result) => {
        // 결과 함수 수행
        if (err) {
        console.error(err);
        }
        //console.log('getDayPlcdata',equip_data,man_data)
       return  response.json({equip:equip_data,man:man_data,summary:summary_data})
    }
    );

});



//설비별 가동데이터_일별
app.post('/getDailyEquipdata', function (request, response) {
    
      let equip_data=[],man_data=[],summary_data=[];

    async.waterfall(
    [
        callback => {
        // 첫번째 함수 수행
        selectDailydata_equip(con,function(ret){
                
                 callback(null,equip_data.push(ret.data));
            })  
        },
        (arg1, callback) => {
        // 두번째 함수 수행

        selectDailydata_man(con,function(ret){
            
            callback(null,man_data.push(ret.data));
        })
        
        },
        (arg1, callback) => {
        // 두번째 함수 수행

        selectDailydata_summary(con,function(ret){
            
            callback(summary_data.push(ret.data));
        })
        
        }
    ],
    (err, result) => {
        // 결과 함수 수행
        if (err) {
        console.error(err);
        }
        //console.log('getDayPlcdata',equip_data,man_data)
       return  response.json({equip:equip_data,man:man_data,summary:summary_data})
    }
    );

});
 


//일일 데이터
function selectDailydata_diff(conn,callback){
    let day_Query = `SELECT DATE(OUT_TIME) AS OUT_TIME,sum(if(LOSS='F',1,0)) AS cnt,sum(if(LOSS='T',1,0)) AS loss
    FROM drum_data_log
    WHERE DATE(OUT_TIME) BETWEEN DATE_SUB(CURDATE(),INTERVAL 1 DAY) AND CURDATE()  AND (STATUS='O' AND STATUS!='D' )
    GROUP BY DATE(OUT_TIME)
    ORDER BY DATE(OUT_TIME) DESC` 

    //console.log(day_Query)


    conn.query(day_Query, function (err,rows){
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
            //console.log('rows',formatDate(new Date(item.IN_TIME)) )



         
            if(item.OUT_TIME!==null){
                item.OUT_TIME=formatDate2(new Date(item.OUT_TIME))
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


//주간 데이터
function selectWeeklydata_diff(conn,callback){
    let day_Query = `select OUT_TIME,ifnull(cnt,0) as cnt,ifnull(loss,0) as loss from

 (SELECT '금주' AS OUT_TIME,sum(if(LOSS='F',1,0)) AS cnt,sum(if(LOSS='T',1,0)) AS loss
    FROM drum_data_log
    WHERE DATE(OUT_TIME) BETWEEN  (SELECT ADDDATE(CURDATE(), - WEEKDAY(CURDATE()) + 0 ))
    AND
        (SELECT ADDDATE(CURDATE(), - WEEKDAY(CURDATE()) + 6 ))  AND (STATUS='O' AND STATUS!='D' )
        
         
         union
        
       SELECT '전주' AS OUT_TIME,sum(if(LOSS='F',1,0)) AS cnt,sum(if(LOSS='T',1,0)) AS loss
    FROM drum_data_log
    WHERE DATE(OUT_TIME) BETWEEN ADDDATE( DATE_SUB(CURDATE(),INTERVAL 1 WEEK), - WEEKDAY(DATE_SUB(CURDATE(),INTERVAL 1 WEEK)) + 0 ) 
                 
                 and
                          ADDDATE( DATE_SUB(CURDATE(),INTERVAL 1 WEEK), - WEEKDAY(DATE_SUB(CURDATE(),INTERVAL 1 WEEK)) + 6 )  AND (STATUS='O' AND STATUS!='D' )
                          
                          ) d3

    ` 

    //console.log(day_Query)


    conn.query(day_Query, function (err,rows){
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
            //console.log('rows',formatDate(new Date(item.IN_TIME)) )



         
            if(item.OUT_TIME!==null){
                item.OUT_TIME=formatDate2(new Date(item.OUT_TIME))
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


//월별 데이터
function selectMonthlydata_diff(conn,callback){
    let day_Query = `select OUT_TIME,ifnull(cnt,0) as cnt,ifnull(loss,0) as loss from 

 (SELECT '금울' AS OUT_TIME,sum(if(LOSS='F',1,0)) AS cnt,sum(if(LOSS='T',1,0)) AS loss
    FROM drum_data_log
    WHERE DATE_FORMAT(date(OUT_TIME),'%Y-%m')=DATE_FORMAT(curdate(),'%Y-%m')  AND (STATUS='O' AND STATUS!='D' )
        
         
         union
        
       SELECT '전월' AS OUT_TIME,sum(if(LOSS='F',1,0)) AS cnt,sum(if(LOSS='T',1,0)) AS loss
    FROM drum_data_log
    WHERE DATE_FORMAT(date(OUT_TIME),'%Y-%m')=DATE_FORMAT(DATE_SUB(now(), INTERVAL 1 MONTH),'%Y-%m')  AND (STATUS='O' AND STATUS!='D' )
                          
                          ) d3
` 

    //console.log(day_Query)


    conn.query(day_Query, function (err,rows){
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
            //console.log('rows',formatDate(new Date(item.IN_TIME)) )



         
            if(item.OUT_TIME!==null){
                item.OUT_TIME=formatDate2(new Date(item.OUT_TIME))
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


//일일 PLC 데이터
function selectDailydata_plc(conn,callback){
  
    let plc_Query = `SELECT unit_id,max(prod_cnt) AS cnt FROM plc_log
    WHERE DATE(CONCAT('20',createTime))=curdate() GROUP BY unit_id order by unit_id asc` 
    
    //console.log(plc_Query)

    conn.query(plc_Query, function (err,rows){
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


//주간 PLC 데이터
function selectWeeklydata_plc(conn,callback){
  
    let plc_Query = `SELECT unit_id,max(prod_cnt) AS cnt FROM plc_log
    WHERE DATE(CONCAT('20',createTime)) BETWEEN DATE_SUB(CURDATE(),INTERVAL 1 week) AND CURDATE() GROUP BY unit_id order by unit_id asc` 
    
    //console.log(plc_Query)

    conn.query(plc_Query, function (err,rows){
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

//월별 PLC 데이터
function selectMonthlydata_plc(conn,callback){
  
    let plc_Query = `    SELECT unit_id,max(prod_cnt) AS cnt FROM plc_log 
    WHERE DATE_FORMAT(DATE(CONCAT('20',createTime)),'%Y-%m')=DATE_FORMAT(curdate(),'%Y-%m')  GROUP BY unit_id order by unit_id asc` 
    
    //console.log(plc_Query)

    conn.query(plc_Query, function (err,rows){
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


//설비별 가동 일별
function selectDailydata_equip(conn,callback){
  
    let plc_Query = `     
SELECT unit_id,DATE_FORMAT(SEC_TO_TIME(SUM(action1+action2+action3)/10), '%H:%i:%s')as realTIme, 
TIMEDIFF(DATE_FORMAT(concat('20',max(createTime)), '%Y-%m-%d %H:%i:%s'),DATE_FORMAT(concat('20',min(createTime)), '%Y-%m-%d %H:%i:%s')) as workTime,max(prod_cnt) as prod_cnt
 FROM 
(SELECT createTime,unit_id,max(action1) AS action1,max(action2) AS action2,max(action3) AS action3,work_YN,prod_cnt FROM plc_log
WHERE prod_cnt<>0 AND DATE(CONCAT('20',createTime))='2021-04-23'
GROUP BY unit_id,prod_cnt) m
GROUP BY unit_id
` 
    
    //console.log(plc_Query)

    conn.query(plc_Query, function (err,rows){
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



//설비별 가동 월별
function selectMonthlydata_equip(conn,callback){
  
    let plc_Query = `     
SELECT unit_id,DATE_FORMAT(SEC_TO_TIME(SUM(action1+action2+action3)/10), '%H:%i:%s')as realTIme, 
TIMEDIFF(DATE_FORMAT(concat('20',max(createTime)), '%Y-%m-%d %H:%i:%s'),DATE_FORMAT(concat('20',min(createTime)), '%Y-%m-%d %H:%i:%s')) as workTime,max(prod_cnt) as prod_cnt
 FROM 
(SELECT createTime,unit_id,max(action1) AS action1,max(action2) AS action2,max(action3) AS action3,work_YN,prod_cnt FROM plc_log
WHERE prod_cnt<>0 AND DATE_FORMAT(DATE(CONCAT('20',createTime)),'%Y-%m')=DATE_FORMAT(curdate(),'%Y-%m') 
GROUP BY unit_id,prod_cnt) m
GROUP BY unit_id
` 
    
    //console.log(plc_Query)

    conn.query(plc_Query, function (err,rows){
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


//설비별 가동 가동인원_일별
function selectDailydata_man(conn,callback){
  
    let plc_Query = `     
                    select day_worker from tbl_worker_info
                    where date(work_date)='2021-04-23'
                    ` 
    
    //console.log(plc_Query)

    conn.query(plc_Query, function (err,rows){
        if(err){
            console.log("MySQL Query Execution Failed....");
            console.log(err);
            var fail_ret={itemsCount:0,data:[],status:'FAIL'}
            if(callback){
                callback(fail_ret);
            }
            return fail_ret;
        }
        console.log('selectDailydata_man',rows)
    
        var ret={itemsCount:rows.length,data:rows,status:'OK'}

        if(callback){
            callback(ret);
        }
        return ret;
    });
}



//설비별 가동 가동인원_월별
function selectMonthlydata_man(conn,callback){
  
    let plc_Query = `     
select sum(day_worker) as day_worker from tbl_worker_info
where DATE_FORMAT(date(work_date),'%Y-%m')=DATE_FORMAT(curdate(),'%Y-%m') 
` 
    
    //console.log(plc_Query)

    conn.query(plc_Query, function (err,rows){
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



//설비별 가동 가동인원_일별_ summary
function selectDailydata_summary(conn,callback){
  
    let plc_Query = `     
SELECT '1차',DATE_FORMAT(SEC_TO_TIME(SUM(action1+action2+action3)/10/3), '%H:%i:%s') as realTime,   TIMEDIFF(DATE_FORMAT(concat('20',max(createTime)), '%Y-%m-%d %H:%i:%s'),DATE_FORMAT(concat('20',min(createTime)), '%Y-%m-%d %H:%i:%s')) as workTime   FROM 
(SELECT createTime,unit_id,max(action1) AS action1,max(action2) AS action2,max(action3) AS action3,work_YN,prod_cnt FROM plc_log
WHERE prod_cnt<>0 AND DATE(CONCAT('20',createTime))='2021-04-23'and unit_id in(1,2,3)
GROUP BY unit_id,prod_cnt) m
union
SELECT '2차',DATE_FORMAT(SEC_TO_TIME(SUM(action1+action2+action3)/10/2), '%H:%i:%s') as realTime, TIMEDIFF(DATE_FORMAT(concat('20',max(createTime)), '%Y-%m-%d %H:%i:%s'),DATE_FORMAT(concat('20',min(createTime)), '%Y-%m-%d %H:%i:%s')) as workTime   FROM 
(SELECT createTime,unit_id,max(action1) AS action1,max(action2) AS action2,max(action3) AS action3,work_YN,prod_cnt FROM plc_log
WHERE prod_cnt<>0 AND DATE(CONCAT('20',createTime))='2021-04-23'and unit_id not in(1,2,3)
GROUP BY unit_id,prod_cnt) m



										
` 
    
    //console.log(plc_Query)

    conn.query(plc_Query, function (err,rows){
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


//설비별 가동 가동인원_월별_ summary
function selectMonthlydata_summary(conn,callback){
  
    let plc_Query = `     
SELECT '1차',DATE_FORMAT(SEC_TO_TIME(SUM(action1+action2+action3)/10/3), '%H:%i:%s') as realTime,   TIMEDIFF(DATE_FORMAT(concat('20',max(createTime)), '%Y-%m-%d %H:%i:%s'),DATE_FORMAT(concat('20',min(createTime)), '%Y-%m-%d %H:%i:%s')) as workTime   FROM 
(SELECT createTime,unit_id,max(action1) AS action1,max(action2) AS action2,max(action3) AS action3,work_YN,prod_cnt FROM plc_log
WHERE prod_cnt<>0 AND DATE_FORMAT(DATE(CONCAT('20',createTime)),'%Y-%m')=DATE_FORMAT(curdate(),'%Y-%m') and unit_id in(1,2,3)
GROUP BY unit_id,prod_cnt) m
union
SELECT '2차',DATE_FORMAT(SEC_TO_TIME(SUM(action1+action2+action3)/10/2), '%H:%i:%s') as realTime, TIMEDIFF(DATE_FORMAT(concat('20',max(createTime)), '%Y-%m-%d %H:%i:%s'),DATE_FORMAT(concat('20',min(createTime)), '%Y-%m-%d %H:%i:%s')) as workTime   FROM 
(SELECT createTime,unit_id,max(action1) AS action1,max(action2) AS action2,max(action3) AS action3,work_YN,prod_cnt FROM plc_log
WHERE prod_cnt<>0 AND DATE_FORMAT(DATE(CONCAT('20',createTime)),'%Y-%m')=DATE_FORMAT(curdate(),'%Y-%m') and unit_id not in(1,2,3)
GROUP BY unit_id,prod_cnt) m



										
` 
    
    //console.log(plc_Query)

    conn.query(plc_Query, function (err,rows){
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






