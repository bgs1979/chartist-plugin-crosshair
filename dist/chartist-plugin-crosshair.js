(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function () {
      return (root.returnExportsGlobal = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['Chartist.plugins.ctCrosshair'] = factory();
  }
}(this, function () {

  /**
   * Chartist.js plugin to display a data label on top of the points in a line chart.
   *
   */
  /* global Chartist */
  function myFun(lb) {
       return lb.toString().replace(/[^-.0-9]/g,'');
    };
  

  (function(window, document, Chartist) {
    'use strict';
    

    var defaultOptions = {
      axisSolid:true,
      showLegend:true,
      crossLine:'ct-cross-line',
    };

    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.ctCrosshair = function(options) {

      options = Chartist.extend({}, defaultOptions, options);

      return function ctCrosshair(chart) {
        if(chart instanceof Chartist.Line) {
         var $chart = $(chart.container);
         var $lgd = $chart
         .append('<div class="ct-legend">Legend</div>')
          .find('.ct-legend').show(); 
          if (!options.showLegend) $lgd.hide();
           
          var $xtoolTip = $chart.append('<div class="arrow_box"></div>').find('.arrow_box').hide();
          var $ytoolTip = $chart.append('<div class="arrow_rbox"></div>').find('.arrow_rbox').hide();  
          var x,y,zl,ofx,ofy;
          var cxp,ctx,hl,vl,low,lft,yy,nule;
          var dlt=5,snm=" ",isZero=false,lastAxe,axeSet=false;
          ofx=$chart.position().left;
          ofy=$chart.position().top;
          var str='';
          chart.on('draw', function(data) {
            if(data.type === 'grid') {
                   zl=[];
                   zl[data.index]=data.element;
                  if (x===undefined && data.index==0){
                      x=data.element.attr('x1');
                      y=data.element.attr('y1');
                      if (options.axisSolid){
                          data.element.addClass("axis");
                      };
                  } else if (data.index==0 && data.element.attr('class')==='ct-grid ct-vertical'){
                    if (options.axisSolid){
                        lastAxe=data.element;
                    };  
                  };     
                  // var x=data.element.attr('class');
             } else if(data.type === 'label') {
                 var nstr= data.text;
                 // str=myFun(nstr)+ '  '+str;
                 // $lgd.html('<span class="ct-label-val">'+str+'<span class="ct-label-val"> : '+ zl.length+' </span></span>');
                   
                    var z=nstr.toString().replace(/[^-.0-9]/g,'');
                    if (z==0){
                      if (options.axisSolid){
                          zl[data.index].addClass("axis");
                          isZero=true;
                      };
                    };
                    
              
            };
            $lgd.css({left: x*1.177 ,top:y*5.23333 }); 
          }).on('created',function(context){
                // $lgd.html('<span class="ct-label-val">:<span class="ct-label-val"> </span></span>'); 
                ctx=context;
                low=ctx.chartRect.y1;
                lft=ctx.chartRect.x1;
                $xtoolTip.hide();
                $ytoolTip.hide();
                vl=x=nule;

          }); 
           
          $chart.on('mousemove', function(e) {
              if ( options.axisSolid && isZero) {
                  if ( typeof lastAxe!==undefined && !axeSet){
                      lastAxe.removeClass("axis");
                      axeSet=true;
                  } ;
              } else if (options.axisSolid && !isZero){
                if ( typeof lastAxe!==undefined && !axeSet){
                      lastAxe.addClass("axis");
                      axeSet=true;
                  } ;
              };   
              var x=e.clientX-ofx,y=e.clientY;
              var kids = $(this).find('.ct-series-a');
              var pt2=0,pt1=0,p;
              kids.children().each(function( index ){
                var cp=$(this);
                if(cp.attr('class')==='ct-point'){
                    if (pt1===0){ pt1=cp}
                    else if(pt1!==0 && pt2===0)  {
                         pt2=cp;
                         dlt=Math.abs(pt1.attr('x1')-pt2.attr('x1'));
                    };
                    
                    if ( Math.abs(cp.attr('x1')-x)<dlt){
                        p=cp;
                        if (typeof cxp === "undefined"){
                            cxp=p; 
                        } else { 
                            cxp.attr({ style: 'stroke-width: 1px;'});
                            cxp=p;
                        };
                    };
                };    
              });
              if (typeof p !== "undefined"){
                snm = p.parent().attr('ct:series-name');
                yy=cxp.attr('y1');
                cxp.attr({style: 'stroke-width: 8px;'});
                var v=cxp.attr('y1'), h=cxp.attr('x1');
                if (typeof vl === "undefined"){
                     hl= ctx.svg.elem('line', {
                            x1: ctx.chartRect.x1,
                            x2: ctx.chartRect.x2,
                            y1: v,
                            y2: v
                        }, options.crossLine);                    
                        vl= ctx.svg.elem('line',{x1: h,x2: h,y1: ctx.chartRect.y1,y2: ctx.chartRect.y2
                                                },options.crossLine);
                } else {
                  vl.attr({x1:h,x2:h});
                  hl.attr({y1:v,y2:v}); 
                  var lb=cxp.attr('ct:meta');
                  var val=cxp.attr('ct:value');
                  
                  $lgd.html('<span class="ct-label-snm">'+ snm +' <span class="ct-label-lbl">'+ lb +' :<span class="ct-label-val"> '
                    + val +' </span></span></span>');

                  $xtoolTip.html(lb).show();
                  $ytoolTip.html(val).show();
                      $xtoolTip.css({
                              left: h-$xtoolTip.width()*0.5  - 4,
                              top: low - $xtoolTip.height() +25
                      });
                      $ytoolTip.css({
                              left: lft - $ytoolTip.width() / 2 -32,
                              top: yy- $ytoolTip.height()+5
                      });      
                };
              };

          }); 

        };
      };
    };

  }(window, document, Chartist));

  return Chartist.plugins.ctCrosshair;

}));
