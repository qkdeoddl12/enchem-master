

$(function(){
     

    var chart1 = c3.generate({
        bindto: '#chart1',
        padding: {
            right: 20
        },
        data: {
            x:'날짜',
            columns: [
			
		    ]
        }
        ,axis : {
        x : {
                type : 'timeseries',
                tick: {
                        format: '%m-%d'
                }
            },
            y: {
            padding: {top: 50, bottom: 0}
        }
        }
    
    });

var chart2 = c3.generate({
        bindto: '#chart2',
        padding: {
            right: 20
        },
        data: {
            x:'날짜',
            columns: [
			['날짜', '2021-01-01', '2021-02-02', '2021-03-03', '2021-04-04', '2021-05-05', '2021-06-05']
			,['생산량', 1233, 243, 364, 675, 736,123]
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
    var chart_prod = c3.generate({
                bindto: '#chart_prod',
                size: {
                    height: 250
                },
                bar: {
                    width: 40
                },
                padding: {
                    left: 60
                },
                color: {
                    pattern: ['#49D6DE', '#DEC849']
                },
                data: {
                    x: 'x',
                    columns:
                        [
                      ['x', '전일', '금일'],
                      ['생산량', 300, 400]
                      ],

                    type: 'bar'
                   ,
                    color: function(inColor, data) {
                        var colors = ['#49D6DE', '#DEC849'];
                        if(data.index !== undefined) {
                            return colors[data.index];
                        }

                        return inColor;
                    }
                },
                axis: {
                    rotated: false,
                    x: {
                        type: 'category'
                    },
                    y: {
                      show: false
                    }
                },
                legend: {
                    show: false
                }
            });




            var chart_wash_oper = c3.generate({
                bindto: '#chart_wash_oper',
                size: {
                    height: 250
                },
                bar: {
                    width: 40
                },
                padding: {
                    left: 60
                },
                color: {
                    pattern: ['#FABF62', '#ACB6DD']
                },
                data: {
                    x: 'x',
                    columns:
                        [
                      ['x', '전일', '금일'],
                      ['Min', 300, 400]
                      ],

                    type: 'bar'
                   ,
                    color: function(inColor, data) {
                        var colors = ['#49D6DE', '#DEC849'];
                        if(data.index !== undefined) {
                            return colors[data.index];
                        }

                        return inColor;
                    }
                },
                axis: {
                    rotated: false,
                    x: {
                        type: 'category'
                    },
                    y: {
                      show: false
                    }
                },
                legend: {
                    show: false
                }
            });


             var chart_wash_loss = c3.generate({
                bindto: '#chart_wash_loss',
                size: {
                    height: 250
                },
                bar: {
                    width: 40
                },
                padding: {
                    left: 60
                },
                color: {
                    pattern: ['#49D6DE', '#DEC849']
                },
                data: {
                    x: 'x',
                    columns:
                        [
                      ['x', '전일', '금일'],
                      ['불량수량', 300, 400]
                      ],

                    type: 'bar'
                   ,
                    color: function(inColor, data) {
                        var colors = ['#49D6DE', '#DEC849'];
                        if(data.index !== undefined) {
                            return colors[data.index];
                        }

                        return inColor;
                    }
                },
                axis: {
                    rotated: false,
                    x: {
                        type: 'category'
                    },
                    y: {
                      show: false
                    }
                },
                legend: {
                    show: false
                }
            });




      


    getDataData()
    setInterval(function () {
        getDataData()
    },3000)

    setInterval(function () {
        $("#txtCurrentDateTime").text(now)
        
    },1000)



    function getDataData(){
        $.ajax({
            url: BOARD_IP+"/getDailyEquipdata",
            type: "POST",
            dataType: "JSON",
            success: function (data) {

               //console.log('getDailyEquipdata',data)

               let equip_data=data.equip[0], man=0,daily_trend=data.daily_trend[0]
               let date_data=['날짜'],equip_list=[],result_data=[],chart_data=[]



               if(data.man[0][0]!=undefined){
                man=data.man[0][0].day_worker
               }


               equip_data.forEach(function(item,index,arr2){ 
                    //console.log(item,index);
                    // $(`#plcData_status_${index+1}`).val(i)
                    $(`#plcData_workTime_${index+1}`).text(item.workTime)
                    $(`#plcData_realTIme_${index+1}`).text(item.realTIme)

                })

                daily_trend.forEach(function(item,index,arr2){ 
                    //console.log(item,index);
                    // $(`#plcData_status_${index+1}`).val(i)
                    if(item.createTime!==null){
                        date_data.push(item.createTime) 
                    }

                    if(item.unit_id!==null){
                        equip_list.push(item.unit_id) 
                    }

                })


                //const array = ['0', 1, 2, '0', '0', 3]
                date_data=Array.from(new Set(date_data));
                equip_list=Array.from(new Set(equip_list));


                //console.log('date_data',date_data,'equip_list',equip_list)

                
                equip_list.forEach(function(item,index,arr2){  
                    //console.log('item',item,index);
                        result_data.push([item+'호기'])
                      daily_trend.forEach(function(item2,index2,arr3){ 
                        //console.log('item2',item2,index2);
                        if(item==item2.unit_id){
                              result_data[index].push(item2.prod_cnt)
                        }
                      
                        

                    })

                })

               

                chart_data.push(date_data)
                result_data.forEach(function(item,index,arr2){  
                    chart_data.push(item)

                })

                 //console.log('chart_data',chart_data)



                chart1.load({
                    columns:  chart_data
                });

                data.plc[0].forEach(function(item,index,arr2){  
                    //console.log('item',item,index);
                        //$("#wash_Grid_1 tr:eq(2) td:eq(1)")

                        let status_val="image/error.png";

                        if(item.status==1){
                            status_val="image/ok.png"
                        }


                        if(item.unit_id<4){
                            $(`#wash_Grid_1 tr:eq(${item.unit_id+1}) td:eq(1)`).html(`<img src="${status_val}" class="plc-status-img">`)
                        }else{
                            $(`#wash_Grid_2 tr:eq(${item.unit_id-2}) td:eq(1)`).html(`<img src="${status_val}" class="plc-status-img">`)
                        }





                })



                





                




               

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
            url: BOARD_IP+"/getDailyTotaldata",
            type: "POST",
            dataType: "JSON",
            success: function (data) {

               //console.log('getDailyTotaldata',data)

            //    let equip_data=data.equip[0], man=data.man[0][0].day_worker,daily_trend=data.daily_trend[0]
            //    let date_data=['날짜'],equip_list=[],result_data=[],chart_data=[]
               

               //console.log('daily_trend',daily_trend)

                let workProd_day1=(data.workProd[0][0].prod_cnt/data.worker[0][0].worker_cnt).toFixed(0)
                let workProd_day2=(data.workProd[0][1].prod_cnt/data.worker[0][1].worker_cnt).toFixed(0)



                let workTime_day1=0
                let workTime_day2=0

                if(data.washTime[0][0]!=undefined){
                    workTime_day1=data.washTime[0][0].prod_min
                    workTime_day2=data.washTime[0][1].prod_min
                }
                


                let loss_day1=data.loss[0][0].loss_cnt
                let loss_day2=data.loss[0][1].loss_cnt
                let total_date=['날짜'],prod_data=['생산량'],lossPer_data=['불량수량']


              

                //console.log('data.total',data.total)


                data.total[0].forEach(function(item,index,arr2){  
                    //console.log('item',item,index);
                        total_date.push(item.loss_date)
                        prod_data.push(item.prod_cnt)
                        lossPer_data.push(item.loss_per)

                })


                

0
               //console.log(data.workProd[0],data.worker[0])


               $("#txtProd_day1").text(workProd_day1)
               $("#txtProd_day2").text(workProd_day2)

               $("#txtWashOper_day1").text(workTime_day1)
               $("#txtWashOper_day2").text(workTime_day2)

               $("#txtWashLoss_day1").text(loss_day1)
               $("#txtWashLoss_day2").text(loss_day2)

                chart_prod.load({
                    columns:   [
                      ['x', '전일', '금일'],
                      ['생산량', workProd_day1, workProd_day2]
                      ]
                });

                chart_wash_oper.load({
                    columns:   [
                      ['x', '전일', '금일'],
                      ['Min', workTime_day1, workTime_day2]
                      ]
                });

                chart_wash_loss.load({
                    columns:   [
                      ['x', '전일', '금일'],
                      ['불량수량', loss_day1, loss_day2]
                      ]
                });

               

                let chart2_data=[]
                chart2_data.push(total_date)
                chart2_data.push(prod_data)
                chart2_data.push(lossPer_data)
                //console.log('chart2',chart2_data)

                 chart2.load({
                    columns:  chart2_data
                });


               
               
            },
            error:function (error) {

            }
        });


    }


   




});


