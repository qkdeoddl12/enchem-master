$(function(){
     var clients1 = [
        { "Index":'1(1차)',"workTime": "00:00:00", "realTime": "00:00:00"},
        { "Index":'2(1차)',"workTime": "00:00:00", "realTime": "00:00:00"},
        { "Index":'3(1차)',"workTime": "00:00:00", "realTime": "00:00:00"}
    ];

    var clients2 = [
        { "Index":'4(2차)',"workTime": "00:00:00", "realTime": "00:00:00"},
        { "Index":'5(2차)',"workTime": "00:00:00", "realTime": "00:00:00"}
    ];

    

 
   
   /*  $("#wash_Grid_1").jsGrid({
        width: "100%",
       
        height: "auto",
 
        
        
        sorting: true,
        paging: true,
 
        data: clients1,
 
        fields: [
            { title: "No", name: "Index", type: "text", width: 30, align: "center" },
            { title: "가동시간", type: "text", width: 50 , name: "workTime", align: "center"  },
            { title: "실가동시간", type: "text", width: 180 , name: "realTime", align: "center"  },
            { title: "가동율 인당", type: "text", name: "", align: "center"  }
        ]
    }); */

     /* $("#wash_Grid_2").jsGrid({
        width: "100%",
        height: "auto",
 
        
        
        sorting: true,
        paging: true,
        pageSize: 5,
      
 
        data: clients2,
 
        fields: [
            { title: "No", name: "Index", type: "text", width: 30, align: "center" },
            { title: "가동시간", type: "text", width: 50 , name: "workTime", align: "center"  },
            { title: "실가동시간", type: "text", width: 180 , name: "realTime", align: "center"  },
            { title: "가동율 인당", type: "text", name: "", align: "center"  }
        ]
    }); */
/* 
    $("#wash_Grid_3").jsGrid({
        width: "100%",
        height: "auto",
 
        
        
        sorting: true,
        paging: true,
        pageSize: 5,
      
 
        data: clients1,
 
        fields: [
            { title: "No", name: "Index", type: "text", width: 30, align: "center" },
            { title: "가동시간", type: "text", width: 50 , name: "workTime", align: "center"  },
            { title: "실가동시간", type: "text", width: 180 , name: "realTime", align: "center"  },
            { title: "가동율 인당", type: "text", name: "", align: "center"  }
        ]
    }); */

   /*  $("#wash_Grid_4").jsGrid({
        width: "100%",
        height: "auto",
 
        
        
        sorting: true,
        paging: true,
        pageSize: 5,
      
 
        data: clients2,
 
        fields: [
            { title: "No", name: "Index", type: "text", width: 30, align: "center" },
            { title: "가동시간", type: "text", width: 50 , name: "workTime", align: "center"  },
            { title: "실가동시간", type: "text", width: 180 , name: "realTime", align: "center"  },
            { title: "가동율 인당", type: "text", name: "", align: "center"  }
        ]
    }); */



    // var chart1 = c3.generate({
    //     bindto: '#chart1',
    //     data: {
    //         x:'date',
    //         columns: [
    //             ['date','2/1','2/2'],
    //             ['전주', 30,50]
    //         ],
    //     }
    
    // });

    var chart1 = c3.generate({
        bindto: '#chart1',
        data: {
            x:'date',
            columns: [
			['date', '2021-03-01', '2021-03-02', '2021-03-03', '2021-03-04', '2021-03-05', '2021-03-05']
			,['생산량', 1233, 243, 364, 675, 736,465]
		]
        }
        ,axis : {
        x : {
                type : 'timeseries',
                tick: {
                        format: '%m-%d'
                }
            }
        }
    
    });

var chart2 = c3.generate({
        bindto: '#chart2',
        data: {
            x:'date',
            columns: [
			['date', '2021-01-01', '2021-02-02', '2021-03-03', '2021-04-04', '2021-05-05', '2021-06-05']
			,['생산량', 1233, 243, 364, 675, 736,123]
		]
        }
        ,axis : {
        x : {
                type : 'timeseries',
                tick: {
                        format: '%m'
                }
            }
        }
    
    });


    getDataData()
    setInterval(function () {
        getDataData()
    },1000)



    function getDataData(){
        $.ajax({
            url: BOARD_IP+"/getDailyEquipdata",
            type: "POST",
            dataType: "JSON",
            success: function (data) {

               console.log('getDailyEquipdata',data)

               let equip_data=data.equip[0], man=data.man[0][0].day_worker,summary=data.summary[0]
               

               console.log('equip_data',equip_data,'man',man)


               equip_data.forEach(function(item,index,arr2){ 
                    console.log(item,index);
                    // $(`#plcData_status_${index+1}`).val(i)
                    $(`#plcData_workTime_${index+1}`).text(item.workTime)
                    $(`#plcData_realTIme_${index+1}`).text(item.realTIme)

                })

                $("#plcData_work_sum").text(summary[0].workTime)
                $("#plcData_real_sum").text(summary[0].realTime)

                $("#plcData_work_sum2").text(summary[1].workTime)
                $("#plcData_real_sum2").text(summary[1].realTime)




               

            //    day1_cnt=data.data[0].cnt//금일
            //    day1_loss=data.data[0].loss//금일
            //    day2_cnt=data.data[1].cnt//전일

            //    let day_diff_per=Math.round(day1_cnt/day2_cnt*100)

            //    if(day_diff_per>100){
            //     $('svg.radial-progress circle').css('stroke','rgb(230 33 33)')
            //        $(".complete").css('stroke-dashoffset','0px')
            //    }else if(day_diff_per<100&&day_diff_per>0){
            //     let chart_val=(100-day_diff_per)*2.2
            //     $('svg.radial-progress circle').css('stroke','rgb(83, 218, 241)')
            //     $(".complete").css('stroke-dashoffset',chart_val+'px')
            //     }else{
            //         $('svg.radial-progress circle').css('stroke','rgb(83, 218, 241)')
            //         $(".complete").css('stroke-dashoffset','220px')
            //     }

            //     $("#day2_cnt").text(`${day2_cnt}`)
            //     $("#day1_cnt").text(`${day1_cnt}`)

            //     $("#2ndCln_out").text(day1_cnt)
            //     $("#2ndCln_loss").text(day1_loss)
            //     $("#2ndCln_loss_per").text( Math.round(day1_loss/day1_cnt*100)+'%' )
            //     $("#UPH_val").text(Math.round(day1_cnt/8).toFixed(1) )
            //     /* 
            //     svg.radial-progress circle {
            //         fill: rgba(0,0,0,0);
            //         stroke: rgb(83, 218, 241);
            //         stroke-dashoffset: 219.91148575129; 
            //         stroke-width: 10;
            //         }
            //      */
                
            //    chart.load({
            //     columns:  [
            //         ['x', '전월', '금월'],
            //         ['생산량', day2_cnt, day1_cnt]
            //         ]
            //   });

            //   $(".percentage").text('')
            //   $(".percentage").text(Math.round(day1_cnt/day2_cnt*100)+'%')


                
               
            },
            error:function (error) {

            }
        });



         $.ajax({
            url: BOARD_IP+"/getDailyEquipdata",
            type: "POST",
            dataType: "JSON",
            success: function (data) {

               console.log('getDailyEquipdata',data)

               let equip_data=data.equip[0], man=data.man[0][0].day_worker,summary=data.summary[0]
               

               console.log('equip_data',equip_data,'man',man)


               equip_data.forEach(function(item,index,arr2){ 
                    console.log(item,index);
                    // $(`#plcData_status_${index+1}`).val(i)
                    $(`#plcData_workTime_${index+1}_mon`).text(item.workTime)
                    $(`#plcData_realTIme_${index+1}_mon`).text(item.realTIme)

                })

                $("#plcData_work_sum_mon").text(summary[0].workTime)
                $("#plcData_real_sum_mon").text(summary[0].realTime)

                $("#plcData_work_sum2_mon").text(summary[1].workTime)
                $("#plcData_real_sum2_mon").text(summary[1].realTime)




               

            //    day1_cnt=data.data[0].cnt//금일
            //    day1_loss=data.data[0].loss//금일
            //    day2_cnt=data.data[1].cnt//전일

            //    let day_diff_per=Math.round(day1_cnt/day2_cnt*100)

            //    if(day_diff_per>100){
            //     $('svg.radial-progress circle').css('stroke','rgb(230 33 33)')
            //        $(".complete").css('stroke-dashoffset','0px')
            //    }else if(day_diff_per<100&&day_diff_per>0){
            //     let chart_val=(100-day_diff_per)*2.2
            //     $('svg.radial-progress circle').css('stroke','rgb(83, 218, 241)')
            //     $(".complete").css('stroke-dashoffset',chart_val+'px')
            //     }else{
            //         $('svg.radial-progress circle').css('stroke','rgb(83, 218, 241)')
            //         $(".complete").css('stroke-dashoffset','220px')
            //     }

            //     $("#day2_cnt").text(`${day2_cnt}`)
            //     $("#day1_cnt").text(`${day1_cnt}`)

            //     $("#2ndCln_out").text(day1_cnt)
            //     $("#2ndCln_loss").text(day1_loss)
            //     $("#2ndCln_loss_per").text( Math.round(day1_loss/day1_cnt*100)+'%' )
            //     $("#UPH_val").text(Math.round(day1_cnt/8).toFixed(1) )
            //     /* 
            //     svg.radial-progress circle {
            //         fill: rgba(0,0,0,0);
            //         stroke: rgb(83, 218, 241);
            //         stroke-dashoffset: 219.91148575129; 
            //         stroke-width: 10;
            //         }
            //      */
                
            //    chart.load({
            //     columns:  [
            //         ['x', '전월', '금월'],
            //         ['생산량', day2_cnt, day1_cnt]
            //         ]
            //   });

            //   $(".percentage").text('')
            //   $(".percentage").text(Math.round(day1_cnt/day2_cnt*100)+'%')


                
               
            },
            error:function (error) {

            }
        });


    }




});


