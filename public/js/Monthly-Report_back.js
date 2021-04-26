$(function(){
     var clients1 = [
        { "Index":'1(1차)',"prodCnt": "1221", "lossCnt": "12"},
        { "Index":'2(1차)',"prodCnt": "1234", "lossCnt": "21"},
        { "Index":'3(1차)',"prodCnt": "4123", "lossCnt": "32"}
    ];

    var clients2= [
        { "Index":'4(2차)',"prodCnt": "4123", "lossCnt": "12"},
        { "Index":'5(2차)',"prodCnt": "1233", "lossCnt": "21"}
    ];

 
   
    $("#wash_Grid_1").jsGrid({
        width: "100%",
       
        height: "auto",
 
        
        
        sorting: true,
        paging: true,
 
        data: clients1,
 
        fields: [
            { title: "No", name: "Index", type: "text", width: 30, align: "center" },
            { title: "생산수량", type: "text", width: 50 , name: "prodCnt", align: "center"  },
            { title: "불량", type: "text", width: 50 , name: "lossCnt", align: "center"  },
                {

                    itemTemplate: function(_, item) {

                        let loss_per=0;
                        return (item.lossCnt/item.prodCnt*100).toFixed(2)+'%'

                        
                           
                        
                    },
                    align: "center",
                    width: 40,
                    sorting: false,
                    title: "불량율",
                    align: "center" 
                }
        ]
    });

     $("#wash_Grid_2").jsGrid({
        width: "100%",
        height: "auto",
 
        
        
        sorting: true,
        paging: true,
        pageSize: 5,
      
 
        data: clients2,
 
        fields: [
            { title: "No", name: "Index", type: "text", width: 30, align: "center" },
            { title: "생산수량", type: "text", width: 50 , name: "prodCnt", align: "center"  },
            { title: "불량", type: "text", width: 50 , name: "lossCnt", align: "center"  },
                {

                    itemTemplate: function(_, item) {

                        let loss_per=0;
                        return (item.lossCnt/item.prodCnt*100,2).toFixed(2)+'%'

                 
                    },
                    align: "center",
                    width: 40,
                    sorting: false,
                    title: "불량율",
                    align: "center" 
                }
        ]
    });



   var chart = c3.generate({
                bindto: '#uv-div',
                size: {
                    height: 150
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
                      ['x', '전월', '금월'],
                      ['생산량', 300, 400]
                      ],

                    type: 'bar'
                   ,
                    color: function(inColor, data) {
                        var colors = ['#FABF62', '#ACB6DD'];
                        if(data.index !== undefined) {
                            return colors[data.index];
                        }

                        return inColor;
                    }
                },
                axis: {
                    rotated: true,
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




});


