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

//일일 금일 날짜
app.post('/getDailyDate', function (request, response) {
    

    async.waterfall(
    [
        callback => {
        // 첫번째 함수 수행
        selectCurrentDate_Daily(con,function(ret){
                
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


//금주 날짜
app.post('/getWeeklyDate', function (request, response) {
    

    async.waterfall(
    [
        callback => {
        // 첫번째 함수 수행
        selectCurrentDate_Weekly(con,function(ret){
                
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


//금월 날짜
app.post('/getMonthlyDate', function (request, response) {
    

    async.waterfall(
    [
        callback => {
        // 첫번째 함수 수행
        selectCurrentDate_Monthly(con,function(ret){
                
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



// 종합현황 - 설비별 현황
app.post('/getDailyEquipdata', function (request, response) {//selectCheckPLCCon
    
      let equip_data=[],man_data=[],Daily_trend_data=[],PLC_data=[];

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

        selectDailyPLC_trend(con,function(ret){
            console.log('ret',ret.data)
            
            callback(null,Daily_trend_data.push(ret.data));
        })
        
        },
        (arg1, callback) => {
        // 두번째 함수 수행

        selectCheckPLCCon(con,function(ret){
            console.log('ret',ret.data)
            
            callback(PLC_data.push(ret.data));
        })
        
        }
    ],
    (err, result) => {
        // 결과 함수 수행
        if (err) {
        console.error('error',err);
        }
        //console.log('getDayPlcdata',equip_data,man_data)
       return  response.json({equip:equip_data,man:man_data,daily_trend:Daily_trend_data,plc:PLC_data})
    }
    );

});



// 종합현황 - 일일 종합현황
app.post('/getDailyTotaldata', function (request, response) {
    
      let washTime_data=[],worker_data=[],loss_data=[],workProd_data=[],total_data=[];

    async.waterfall(
    [
        callback => {
        // 첫번째 함수 수행
        selectData_washTime(con,function(ret){
                
                 callback(null,washTime_data.push(ret.data));
            })  
        },
        (arg1, callback) => {
        // 두번째 함수 수행

        selectData_worker(con,function(ret){
            
            callback(null,worker_data.push(ret.data));
        })
        
        },
        (arg1, callback) => {
        // 두번째 함수 수행

            selectData_lossData(con,function(ret){
                console.log('ret',ret.data)
                
                callback(null,loss_data.push(ret.data));
            })
        
        },
        (arg1, callback) => {
        // 두번째 함수 수행

            selectData_workProd(con,function(ret){
                console.log('ret',ret.data)
                
                callback(null,workProd_data.push(ret.data));
            })
        
        },
        (arg1, callback) => {
        // 두번째 함수 수행

            selectData_prodTotal(con,function(ret){
                console.log('ret',ret.data)
                
                callback(total_data.push(ret.data));
            })
        
        }
    ],
    (err, result) => {
        // 결과 함수 수행
        if (err) {
        console.error('error',err,result);
        }
        //console.log('getDayPlcdata',equip_data,man_data)
       return  response.json({washTime:washTime_data,worker:worker_data,loss:loss_data,workProd:workProd_data,total:total_data})
    }
    );

});
 


//일일 데이터
function selectDailydata_diff(conn,callback){
    let day_Query = `    SELECT DATE(CREATETIME) AS OUT_TIME,sum(if(LOSS='F',if(STATUS='O',1,0),0)) AS cnt,sum(if(LOSS='T',1,0)) AS loss,sum(if(STATUS='I',1,0)) AS in_cnt
    FROM drum_data_log
    WHERE DATE(CREATETIME) BETWEEN DATE_SUB(curdate(),INTERVAL 1 DAY) AND curdate()  AND STATUS IN ('O','I')
    GROUP BY DATE(CREATETIME)
    ORDER BY DATE(CREATETIME) DESC` 

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
    let day_Query = `   
     select OUT_TIME,ifnull(cnt,0) as cnt,ifnull(loss,0) as loss,ifnull(in_cnt,0) as in_cnt from

 (SELECT '금주' AS OUT_TIME,sum(if(LOSS='F',if(STATUS='O',1,0),0)) AS cnt,sum(if(LOSS='T',1,0)) AS loss,sum(if(STATUS='I',1,0)) AS in_cnt
    FROM drum_data_log
    WHERE DATE(CREATETIME) BETWEEN  (SELECT ADDDATE(CURDATE(), - WEEKDAY(CURDATE()) + 0 ))
    AND
        (SELECT ADDDATE(CURDATE(), - WEEKDAY(CURDATE()) + 6 ))  AND (STATUS IN ('O','I') AND STATUS!='D' )
        
         
         union
        
       SELECT '전주' AS OUT_TIME,sum(if(LOSS='F',if(STATUS='O',1,0),0)) AS cnt,sum(if(LOSS='T',1,0)) AS loss,sum(if(STATUS='I',1,0)) AS in_cnt
    FROM drum_data_log
    WHERE DATE(CREATETIME) BETWEEN ADDDATE( DATE_SUB(CURDATE(),INTERVAL 1 WEEK), - WEEKDAY(DATE_SUB(CURDATE(),INTERVAL 1 WEEK)) + 0 ) 
                 
                 and
                          ADDDATE( DATE_SUB(CURDATE(),INTERVAL 1 WEEK), - WEEKDAY(DATE_SUB(CURDATE(),INTERVAL 1 WEEK)) + 6 )  AND (STATUS IN ('O','I') AND STATUS!='D' )
                          
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
    let day_Query = `         select OUT_TIME,ifnull(cnt,0) as cnt,ifnull(loss,0) as loss,ifnull(in_cnt,0) as in_cnt from 

 (SELECT '금월' AS OUT_TIME,sum(if(LOSS='F',if(STATUS='O',1,0),0)) AS cnt,sum(if(LOSS='T',1,0)) AS loss,sum(if(STATUS='I',1,0)) AS in_cnt
    FROM drum_data_log
    WHERE DATE_FORMAT(date(CREATETIME),'%Y-%m')=DATE_FORMAT(curdate(),'%Y-%m')  AND (STATUS IN ('O','I') AND STATUS!='D' )
        
         
         union
        
       SELECT '전월' AS OUT_TIME,sum(if(LOSS='F',if(STATUS='O',1,0),0)) AS cnt,sum(if(LOSS='T',1,0)) AS loss,sum(if(STATUS='I',1,0)) AS in_cnt
    FROM drum_data_log
    WHERE DATE_FORMAT(date(CREATETIME),'%Y-%m')=DATE_FORMAT(DATE_SUB(now(), INTERVAL 1 MONTH),'%Y-%m')  AND (STATUS IN ('O','I') AND STATUS!='D' )
                          
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
  
    let plc_Query = `      SELECT unit_id,SUM(cnt) AS cnt FROM 
        (SELECT DATE(CONCAT('20',createTime)),unit_id,max(prod_cnt) AS cnt FROM plc_log
    WHERE DATE(CONCAT('20',createTime)) BETWEEN
        (SELECT ADDDATE(CURDATE(), - WEEKDAY(CURDATE()) + 0 ))
    AND
        (SELECT ADDDATE(CURDATE(), - WEEKDAY(CURDATE()) + 6 )) AND CURDATE() GROUP BY DATE(CONCAT('20',createTime)),unit_id order by unit_id ASC) prod
        GROUP BY  unit_id` 
    
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
  
    let plc_Query = `       SELECT unit_id,SUM(cnt) AS cnt FROM 
        (SELECT DATE(CONCAT('20',createTime)),unit_id,max(prod_cnt) AS cnt FROM plc_log
    WHERE DATE_FORMAT(DATE(CONCAT('20',createTime)),'%Y-%m')=DATE_FORMAT(curdate(),'%Y-%m') AND CURDATE() GROUP BY DATE(CONCAT('20',createTime)),unit_id order by unit_id ASC) prod
        GROUP BY  unit_id
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


//설비별 가동 일별
function selectDailydata_equip(conn,callback){
  
    let plc_Query = `     
SELECT unit_id,DATE_FORMAT(SEC_TO_TIME(SUM(action1+action2+action3)/10), '%H:%i:%s')as realTIme, 
TIMEDIFF(DATE_FORMAT(concat('20',max(createTime)), '%Y-%m-%d %H:%i:%s'),DATE_FORMAT(concat('20',min(createTime)), '%Y-%m-%d %H:%i:%s')) as workTime,max(prod_cnt) as prod_cnt
 FROM 
(SELECT createTime,unit_id,max(action1) AS action1,max(action2) AS action2,max(action3) AS action3,work_YN,prod_cnt FROM plc_log
WHERE prod_cnt<>0 AND DATE(CONCAT('20',createTime))=curdate()
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



//설비별 가동 가동인원_일별_ summary
function selectDailyPLC_trend(conn,callback){
  
    let plc_Query = `SELECT DATE(CONCAT('20',createTime)) as createTime,unit_id,max(prod_cnt) prod_cnt FROM plc_log
where prod_cnt<>0 GROUP BY DATE(CONCAT('20',createTime)),unit_id
order by DATE(CONCAT('20',createTime)) desc` 
    
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

        rows.forEach(function(item,index,arr2){
            //console.log('rows',formatDate(new Date(item.IN_TIME)) )



         
            if(item.createTime!==null){
                item.createTime=formatDate2(new Date(item.createTime))
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


//일일 종합현황 - 세정 작업 공수
function selectData_washTime(conn,callback){
  
    let plc_Query = `     
          SELECT '전일' as day,ROUND(IFNULL((TIME_TO_SEC('12:00:00')/60)/SUM(prod_cnt),0)) as prod_min FROM  
        (SELECT unit_id,SEC_TO_TIME(SUM(action1+action2+action3)/10) as realTIme,max(prod_cnt) as prod_cnt
        FROM 
        (SELECT createTime,unit_id,max(action1) AS action1,max(action2) AS action2,max(action3) AS action3,work_YN,prod_cnt FROM plc_log
        WHERE prod_cnt<>0 AND DATE(CONCAT('20',createTime))=DATE_ADD(CURDATE(),INTERVAL -1 day) 
        GROUP BY unit_id,prod_cnt) m
        GROUP BY unit_id) d
        UNION 
        SELECT '금일' day,ROUND(IFNULL((sum(realTime)/60)/SUM(prod_cnt),0)) as prod_min FROM 
        (SELECT unit_id,SEC_TO_TIME(SUM(action1+action2+action3)/10) as realTIme,max(prod_cnt) as prod_cnt
        FROM 
        (SELECT createTime,unit_id,max(action1) AS action1,max(action2) AS action2,max(action3) AS action3,work_YN,prod_cnt FROM plc_log
        WHERE prod_cnt<>0 AND DATE(CONCAT('20',createTime))=CURDATE() 
        GROUP BY unit_id,prod_cnt) m
        GROUP BY unit_id) d
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

//일일 종합현황 - 일일 투입인원
function selectData_worker(conn,callback){
  
    let plc_Query = `     
        SELECT (day_worker+night_worker) AS worker_cnt FROM tbl_worker_info
        ORDER BY work_date DESC LIMIT 2` 
    
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


//일일 종합현황 - 일일 불량수량
function selectData_lossData(conn,callback){
  
    let plc_Query = `       
SELECT DAY,loss_date,loss_cnt FROM 
(SELECT '전일' AS day,date(CREATETIME) as loss_date,SUM(if(LOSS='T',1,0)) AS loss_cnt FROM drum_data_log
GROUP BY date(CREATETIME) 
ORDER BY date(CREATETIME) desc LIMIT 1 OFFSET 1) d
UNION
SELECT DAY,loss_date,loss_cnt FROM 
(SELECT '금일' AS day,date(CREATETIME) AS loss_date,SUM(if(LOSS='T',1,0)) AS loss_cnt FROM drum_data_log
GROUP BY date(CREATETIME) 
ORDER BY date(CREATETIME) desc LIMIT 1 OFFSET 0) d` 
    
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



//일일 종합현황 - 일일 인당 생산량
function selectData_workProd(conn,callback){
  
    let plc_Query = `       
SELECT DAY,prod_date,prod_cnt FROM 
(SELECT '전일' AS day,date(CREATETIME) as prod_date,SUM(if(LOSS='F',1,0)) AS prod_cnt FROM drum_data
WHERE LOSS='F' AND STATUS='O'
GROUP BY date(CREATETIME) 
ORDER BY date(CREATETIME) desc LIMIT 1 OFFSET 1) d
UNION
SELECT DAY,prod_date,prod_cnt FROM 
(SELECT '금일' AS day,date(CREATETIME) AS prod_date,SUM(if(LOSS='F',1,0)) AS prod_cnt FROM drum_data
WHERE LOSS='F' AND STATUS='O'
GROUP BY date(CREATETIME) 
ORDER BY date(CREATETIME) desc LIMIT 1 OFFSET 0) d` 
    
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



//일일 종합현황 - 일일 생산수량 및 불량률
function selectData_prodTotal(conn,callback){
  
    let plc_Query = `       
SELECT loss_date,prod_cnt,round(loss_cnt/prod_cnt*100) as loss_per
from
(SELECT date(CREATETIME) as loss_date,SUM(if(LOSS='T',1,0)) AS loss_cnt FROM drum_data_log
GROUP BY date(CREATETIME) 
ORDER BY date(CREATETIME) desc LIMIT 7 ) d1
LEFT join
(SELECT '금일' AS day,date(CREATETIME) AS prod_date,SUM(if(LOSS='F',1,0)) AS prod_cnt FROM drum_data
WHERE LOSS='F' AND STATUS='O'
GROUP BY date(CREATETIME) 
ORDER BY date(CREATETIME) desc LIMIT 7) d2
ON d1.loss_date=d2.prod_date
ORDER BY loss_date asc
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

         rows.forEach(function(item,index,arr2){
            //console.log('rows',formatDate(new Date(item.IN_TIME)) )

            if(item.loss_date!==null){
                item.loss_date=formatDate2(new Date(item.loss_date))
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




//일일 금일 날짜
function selectCurrentDate_Daily(conn,callback){
  
    let plc_Query = `       
	SELECT DATE_FORMAT(curdate(),'%m월 %d일') as date_data,day_worker,night_worker FROM tbl_worker_info
	WHERE date(work_date)=CURDATE()
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

         rows.forEach(function(item,index,arr2){
            //console.log('rows',formatDate(new Date(item.IN_TIME)) )

            // if(item.date_data!==null){
            //     item.date_data=formatDate2(new Date(item.date_data))
            // }
           
            //console.log(item)
        })
    
        var ret={itemsCount:rows.length,data:rows,status:'OK'}

        if(callback){
            callback(ret);
        }
        return ret;
    });
}



//금주 날짜
function selectCurrentDate_Weekly(conn,callback){
  
    let plc_Query = `       
 SELECT DATE_FORMAT(min(DATE(CREATETIME)),'%m월 %d일') AS startDate ,DATE_FORMAT(MAX(DATE(CREATETIME)),'~ %d일') AS endDate FROM drum_data
where DATE(CREATETIME) BETWEEN
        (SELECT ADDDATE(CURDATE(), - WEEKDAY(CURDATE()) + 0 ))
    AND
        (SELECT ADDDATE(CURDATE(), - WEEKDAY(CURDATE()) + 6 )) AND CURDATE()
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

         rows.forEach(function(item,index,arr2){
            //console.log('rows',formatDate(new Date(item.IN_TIME)) )

            // if(item.startDate!==null){
            //     item.startDate=formatDate2(new Date(item.datstartDatee_data))
            // }

            // if(item.endDate!==null){
            //     item.endDate=formatDate2(new Date(item.endDate))
            // }
           
            //console.log(item)
        })
    
        var ret={itemsCount:rows.length,data:rows,status:'OK'}

        if(callback){
            callback(ret);
        }
        return ret;
    });
}


//금월 날짜
function selectCurrentDate_Monthly(conn,callback){
  
    let plc_Query = `       
 SELECT DATE_FORMAT(min(DATE(CREATETIME)),'%m월 %d일') AS startDate ,DATE_FORMAT(MAX(DATE(CREATETIME)),'~ %d일') AS endDate FROM drum_data
where DATE_FORMAT(DATE(CREATETIME),'%Y-%m')=DATE_FORMAT(curdate(),'%Y-%m')
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

         rows.forEach(function(item,index,arr2){
            //console.log('rows',formatDate(new Date(item.IN_TIME)) )

           
            // if(item.startDate!==null){
            //     item.startDate=formatDate2(new Date(item.datstartDatee_data))
            // }

            // if(item.endDate!==null){
            //     item.endDate=formatDate2(new Date(item.endDate))
            // }
            //console.log(item)
        })
    
        var ret={itemsCount:rows.length,data:rows,status:'OK'}

        if(callback){
            callback(ret);
        }
        return ret;
    });
}


//plc 상태
function selectCheckPLCCon(conn,callback){
  
    let plc_Query = `       

select unit_id,status FROM (SELECT startTime,unit_id,status FROM plc_log_work
WHERE DATE(startTime)=curdate()   ORDER BY startTime DESC LIMIT 10) plc
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

         rows.forEach(function(item,index,arr2){
            //console.log('rows',formatDate(new Date(item.IN_TIME)) )

           
            // if(item.startDate!==null){
            //     item.startDate=formatDate2(new Date(item.datstartDatee_data))
            // }

            // if(item.endDate!==null){
            //     item.endDate=formatDate2(new Date(item.endDate))
            // }
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






