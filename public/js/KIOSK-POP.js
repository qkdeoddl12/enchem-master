

$(function(){

    var status=[
        {CODE:'I',NAME:'입고'},
        {CODE:'O',NAME:'출고'}
    ]


    var loss_data=[
        {CODE:'T',NAME:'불량'},
        {CODE:'F',NAME:'정상'}
    ]


    setInterval(function () {
        $.ajax({
            url: "/checkWorker",
            type: "POST",
            dataType: "JSON",
            success: function (data) {

                if(data.data.length!=0){
                    $("#txtWorkerMsg").text(`주 ${data.data[0].day_worker}명/ 야 ${data.data[0].night_worker}명`)
                  

                }
                
               
            },
            error:function (error) {

            }
        });
    },1000)
     



 
   


var barcode="";
    $(document).keydown(function(e) 
    {
        var code = (e.keyCode ? e.keyCode : e.which);

        console.log('barcode1',barcode)

    

        if(code==13)// Enter key hit
        {
            
            
            if($(".active-button").text()!='전체'){
                console.log('barcode2',barcode)

            barcode=barcode.split('¿')
            barcode=barcode[0]
            if($(".active-button").text()=='입고'||$(".active-button").text()=='출고'||$(".active-button").text()=='불량'){
                if(barcode!='RECEIVE'||barcode!='LOSS'||barcode!='SHIPPING'){
                    $.ajax({
                    url: "/createPOPData",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        barcode: function () {

                            return barcode.substring(1,barcode.length)
                            //return barcode
                        },
                        status: function () {
                            let check_val='';

                            if($(".active-button").data('oper')!==undefined){
                                check_val=$(".active-button").data('oper')
                            }

                            return check_val
                        }

                    },
                    success: function (data) {
                        console.log('createPOPData',data)
                        barcode=''
                        $("#txtMsg").text(data.msg)
                        $("#dataGrid").jsGrid('loadData')
                    },
                    error:function (error) {
                        barcode=''
                        console.log('error',error)
                    }
                });
                }else{

                    console.log('barcode search',barcode)

                    switch(barcode){
                          case 'RECEIVE' :
                              if($(".active-button").text()!='입고'){
                                console.log('barcode ret',barcode)
                                  $("#btnSearch_in").trigger('click')
                              }
                              console.log('barcode err',barcode)
                              
                              break;
                          case 'SHIPPING' :
                              if($(".active-button").text()!='출고'){
                                  $("#btnSearch_out").trigger('click')
                                  console.log('barcode ret',barcode)
                              }
                              console.log('barcode err',barcode)
                              break;
                          case 'LOSS' :
                              if($(".active-button").text()!='불량'){
                                  $("#btnSearch_loss").trigger('click')
                                  console.log('barcode ret',barcode)
                              }
                              console.log('barcode err',barcode)
                              break;
                      }
                  

                }
            }else{

            }
                
                
            }
            barcode=''
            
        
           
        }
        else if(code==9)// Tab key hit
        {
            
        }
        else
        {
            barcode=barcode+String.fromCharCode(code);
            console.log('barcode9',barcode)
        }



    });

    $(".btn-nav button").click(function(){
        if($(this).attr('id')!='btnInputWorker_day'||$(this).attr('id')!='btnInputWorker_night'){
            $(".btn-nav button").removeClass('active-button')
        $(this).addClass('active-button')
        $("#txtBarcode").val('')
        
        if($(".btn-nav > .active-button").text()=='전체'){
            $('.searchFunc').show()
        }else{
            $('.searchFunc').hide()
        }

        if($(".btn-nav > .active-button").text()=='입고'){
            $("#dataGrid").jsGrid("fieldOption", "workCancel", "visible", false);
            $("#dataGrid").jsGrid("fieldOption", "delete", "visible", true);
        }else{
            $("#dataGrid").jsGrid("fieldOption", "workCancel", "visible", true);
            $("#dataGrid").jsGrid("fieldOption", "delete", "visible", false);
        }


        if($(".btn-nav > .active-button").text()!='주간'&&$(".btn-nav > .active-button").text()!='야간')
        $(".btn-date button").removeClass('active-button-date')
        $(".btn-date button").first().addClass('active-button-date')
        
        $("#dataGrid").jsGrid('loadData')
        $("#dataGrid").jsGrid('openPage',1)
        }

        
   
    })

    $(".btn-date button").click(function(){
        $(".btn-date button").removeClass('active-button-date')
        $(this).addClass('active-button-date')
        $("#txtBarcode").val('')
        $("#dataGrid").jsGrid('loadData')
        $("#dataGrid").jsGrid('openPage',1)
    })

    $("#btnSearch_txt").click(function(){
        $("#dataGrid").jsGrid('loadData')
        $("#dataGrid").jsGrid('openPage',1)
    })

    $("#btnWorkerInfoSave").click(function () {
        $.ajax({
            url: "/saveWorker",
            type: "POST",
            dataType: "JSON",
            data: {
                idx: function () {
                    return $("#txtWorkInfoIDX").val()
                },
                cnt: function(){
                    return $("#txtWorkDis").val()
                },
                type: function(){
                    return $("#txtWorkInfoType").val()
                }
            },
            success: function (data) {
                console.log('removePOPData',data)

               // $("#txtWorkerMsg").text(`주 ${$("#txtDayWorker").val()}명/ 야 ${$("#txtNightWorker").val()}명`)


                $("#workModal").modal('hide')
               
            },
            error:function (error) {

            }
        });
    })
    $("#btnInputWorker_day").click(function () {
        $('#workModal').modal('show')
        $("#txtWorkInfoType").val('day')
        $.ajax({
            url: "/checkWorker",
            type: "POST",
            dataType: "JSON",
            success: function (data) {
                console.log('removePOPData',data,data.data.length)

                if(data.data.length!=0){
                    $("#txtWorkInfoIDX").val(data.data[0].wIDX)

                    if($("#txtWorkInfoType").val()=='day'){
                        $("#txtWorkDis").val(data.data[0].day_worker)
                    }else{
                        $("#txtWorkDis").val(data.data[0].night_worker)
                    }
                    
                    
                }
                
               
            },
            error:function (error) {

            }
        });

        
    })

    $("#btnInputWorker_night").click(function () {
        $('#workModal').modal('show')
        $("#txtWorkInfoType").val('night')
        $.ajax({
            url: "/checkWorker",
            type: "POST",
            dataType: "JSON",
            success: function (data) {
                console.log('removePOPData',data,data.data.length)

                if(data.data.length!=0){
                    $("#txtWorkInfoIDX").val(data.data[0].wIDX)

                    if($("#txtWorkInfoType").val()=='day'){
                        $("#txtWorkDis").val(data.data[0].day_worker)
                    }else{
                        $("#txtWorkDis").val(data.data[0].night_worker)
                    }
                    
                    
                }
                
               
            },
            error:function (error) {

            }
        });

        
    })


   /*  $('#workModal').on('show.bs.modal', function (e) {

        console.log('workModal',$(this))
       
         $.ajax({
            url: "/checkWorker",
            type: "POST",
            dataType: "JSON",
            success: function (data) {
                console.log('removePOPData',data,data.data.length)

                if(data.data.length!=0){
                    $("#txtWorkInfoIDX").val(data.data[0].wIDX)

                    if($("#txtWorkInfoType")=='day'){
                        $("#txtWorkDis").val(data.data[0].day_worker)
                    }else{
                        $("#txtWorkDis").val(data.data[0].night_worker)
                    }
                    
                    
                }
                
               
            },
            error:function (error) {

            }
        });
 
    }) */


    $('#workModal').on('hidden.bs.modal', function (e) {
    $("#workModal input").val('')

    })


    $("#workModal form button").click(function(e){
        console.log("this",$(this).val())

        if($(this).val()!='del'){
            if($(this).val()=='reset'){
                $("#txtWorkDis").val('');
            }else{
                $("#txtWorkDis").val($("#txtWorkDis").val()+$(this).val())
            }
          
        }else if($(this).val()=='del'){

            console.log('txtWorkDis',$("#txtWorkDis").val().length)

            $("#txtWorkDis").val($("#txtWorkDis").val().substring( 0, $("#txtWorkDis").val().length-1 ))
        }
        
    })


 
    $("#dataGrid").jsGrid({
        width: "98%",
        height: "745px",
        editing: false,
        autoload: true,
        pageIndex:1,  
        sorting: true,
        paging: true,
        controller:  {
                loadData: function(filter) {
                    var d = $.Deferred();
                    $.ajax({
                        type: "POST",
                        url: "/getPOPdata",
                        dataType: "JSON",
                        data: {
                            text: function () {
                                return $("#txtBarcode").val()
                            },
                            type:function(){
                                let check_type=''
                                
                                if($(".active-button").data('oper')!==undefined){
                                    check_type=$(".active-button").data('oper')
                                }
                                return check_type
                            },
                             date:function(){
                                
                                return $(".active-button-date").data('date')

                            }
                        },
                    }).done(function(response) {
                        console.log('ok',response)
                        //ALLselectedItems=response.data;
                        // if(response.status == "OK") {
                        //     $("#txtMsg").text('조회되었습니다.')
                        // }else{
                        //     $("#txtMsg").text('조회가 실패되었습니다.')
                        // }
                        $("#txtCntMsg").text(`${response.itemsCount}건`)

                        d.resolve(response.data);
                        
                    });
                    return d.promise();
                }

            },
 
        fields: [
            { title: "용기번호", type: "text", width: 30 , name: "BARCODE", align: "center"  },
            { title: "상태", type: "select", width: 5 , name: "STATUS", align: "center", items: status, valueField: "CODE", textField: "NAME"  },
            { title: "입고시간", type: "text", width: 30 , name: "IN_TIME", align: "center"  },
            { title: "출고시간", type: "text", width: 30 , name: "OUT_TIME", align: "center"  },
            { title: "불량", type: "select", width: 10 , name: "LOSS", align: "center", items: loss_data, valueField: "CODE", textField: "NAME"  },
                {

                    itemTemplate: function(_, item) {
                        

                            return $('<button type="button" class="btn btn-danger btn-grid-size">' +
                                '</button>').text("삭제")
                                .on("click", function() {

                                    if(confirm(`용기번호 : ${item.BARCODE} 삭제처리하시겠습니까?`)){
                                        $.ajax({
                                            url: "/removePOPData",
                                            type: "POST",
                                            dataType: "JSON",
                                            data: {
                                                idx: function () {

                                                    return item.IDX
                                                }

                                            },
                                            success: function (data) {
                                                console.log('removePOPData',data)
                                                
                                                $("#txtMsg").text(data.msg)

                                                $("#dataGrid").jsGrid('loadData')
                                            },
                                            error:function (error) {
                                                $("#txtMsg").text(data.msg)

                                            }
                                        });

                                    }

                                });
                        
                    },
                    align: "center",
                    width: 28,
                    sorting: false,
                    name: 'delete'
                    
                }, {

                    itemTemplate: function(_, item) {
                        

                            return $('<button type="button" class="btn btn-danger btn-grid-size">' +
                                '</button>').text("작업취소")
                                .on("click", function() {

                                    if(confirm(`용기번호 : ${item.BARCODE} 작업취소 처리하시겠습니까?`)){
                                        $.ajax({
                                            url: "/cancelData",
                                            type: "POST",
                                            dataType: "JSON",
                                            data: {
                                                barcode: function () {

                                                    return item.BARCODE
                                                },
                                                status: function () {

                                                    return item.STATUS
                                                },
                                                idx: function () {

                                                    return item.IDX
                                                }

                                            },
                                            success: function (data) {
                                                $("#txtMsg").text(data.msg)

                                                $("#dataGrid").jsGrid('loadData')
                                            },
                                            error:function (error) {
                                                console.log('error',error)
                                                $("#txtMsg").text(data.msg)

                                            }
                                        });

                                    }

                                });
                        
                    },
                    align: "center",
                    width: 28,
                    sorting: false,
                    name:'workCancel'
                },
                {

                    itemTemplate: function(_, item) {

                        let btn_name="정상처리"
                        let alert_msg=`용기번호 : ${item.BARCODE} 불량취소하시겠습니까?`
                        let btn_class='btn-success'
                        if(item.LOSS=='F'){
                            btn_name="불량처리"
                            alert_msg=`용기번호 : ${item.BARCODE} 불량처리하시겠습니까?`
                            btn_class='btn-warning'
                        }
                        

                            return $(`<button type="button" class="btn  ${btn_class} btn-grid-size">` +
                                '</button>').text(btn_name)
                                .on("click", function() {

                                    if(confirm(alert_msg)){
                                        $.ajax({
                                            url: "/mngLOSS",
                                            type: "POST",
                                            dataType: "JSON",
                                            data: {
                                                barcode: function () {

                                                    return item.BARCODE
                                                },
                                                loss:function(){
                                                    return item.LOSS
                                                },
                                                idx:function(){
                                                    return item.IDX
                                                }

                                            },
                                            success: function (data) {
                                                console.log('mngLOSS',data)
                                                $("#txtMsg").text(data.msg)

                                                $("#dataGrid").jsGrid('loadData')
                                            },
                                            error:function (error) {
                                                $("#txtMsg").text(data.msg)

                                            }
                                        });

                                    }

                                });
                        
                    },
                    align: "center",
                    width: 28,
                    sorting: false
                }
        ]
    });
});


