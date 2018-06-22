(function($) {
    'use strict';
        var ModuleName = 'frzTable';
    
        var Module = function ( ele, options ) {
            this.ele = ele;
            this.$ele = $(ele);
            this.option = options;
            this.$arrow = $(`
            <div class="frzTable-arrow">
                <div class="frzTable-preArrow"><span> < </span></div>
                <div class="frzTable-nextArrow"><span> > </span></div>                        
            </div>`);

            this.$frzTableTr = this.$ele.children('.tr');
            this.$frzTableWrap = this.$ele.find('.tr>.td:nth-child(2)');
            this.$frzTableSlider = this.$ele.find('.tr>.td:nth-child(2)>div:first-child');
            this.$frzTableCol = this.$ele.find('.tr>.td:nth-child(2)>div:first-child>div');
            this.$frzTableTitleR = this.$ele.find('.tr:first-child>.td:nth-child(2)>div:first-child>div');
            this.$frzTableTitleC = this.$ele.find('.tr>.td:nth-child(1)');
        
        };
    
        Module.DEFAULT = {
		    count: {
		        slide: 2,
		        show: 3
		    },
		    speed: .5,
		    whenClick: function($element) {
		        console.log($element);
		    }
        };

        Module.prototype.init = function(){

        	this.$ele.addClass('frzTable');
            this.$frzTableTr.addClass('frzTable-tr');
            this.$frzTableWrap.addClass('frzTable-wrap');
            this.$frzTableSlider.addClass('frzTable-slider');
            this.$frzTableCol.addClass('frzTable-cols');

            this.$frzTableTitleR.addClass('frzTitle');
            this.$frzTableTitleC.addClass('frzTitle');

            for(var i = 1; i <= ($('.frzTable-cols').length / $('.frzTable-slider').length); i++){
                $('.frzTable-cols:nth-child(' + i + ')').not('.frzTitle').attr('data-frzTable-Idx',i);
            }
            this.$ele.append(this.$arrow);

            this.showCol();

            if(this.option.count.slide > this.option.count.show){
                this.option.count.slide = this.option.count.show;
            }     
        }

        Module.prototype.whenClick = function ($element) {
            console.log($element);
        }   

        Module.prototype.showCol = function() { 
            if(this.option.count.show <= 4){
                $('.frzTable-cols').addClass('frzTable-col'+ String(this.option.count.show));
            }else{
                $('.frzTable-cols').addClass('frzTable-col4');
            }

        };

        Module.prototype.activeChange = function(e) { 
        	this.$frzTableCol.removeClass('frzActive').removeClass('frzChange');        	
            $(e).siblings('.frzTable-cols').addClass('frzChange');            
            var idx = $(e).attr('data-frztable-Idx');
            $('.frzTable-cols[data-frztable-Idx ="' + idx + '"]').addClass('frzChange');
            $(e).addClass('frzActive').removeClass('frzChange');
        };

        Module.prototype.getColWidth = function () {
            return $('.frzTable-cols').outerWidth();
        }

        function getOriXMrx (oriString) {
            return parseInt(oriString.split(',')[4]);
        }
        function setTransformXToMrx (oriString, x) {
            var mrxAry = oriString.split(',');
            mrxAry[4] = x;
            return mrxAry.join();
        }    
      
        Module.prototype.moveCol = function (pos) {

            var trnsformX;
            var state = pos;
            var toShow = this.option.count.show;
            if(this.option.count.slide > this.option.count.show){
                toShow = this.option.count.show
            }
            var allCol = state + toShow ;
            var slider = $('.frzTable-slider');
            var ori = getOriXMrx(slider.css('transform'));
            $('.frzTable-slider').css('transition-duration', this.option.speed +'s')

            if( allCol < 7){
                state = state;
                $('.frzTable-nextArrow').show();
                if(state === 0){
                    $('.frzTable-preArrow').hide();
                }

            }else{
                state = state + ( 7 - allCol ) ;
                if(allCol = 7) {
                    $('.frzTable-nextArrow').hide();
                }
            } 

            switch (state){              
                case 0:
                trnsformX = 0;
                break;
                case 1:
                trnsformX = this.getColWidth()*(-1);
                break;
                case 2:
                trnsformX = this.getColWidth()*(-2);
                break;
                case 3:
                trnsformX = this.getColWidth()*(-3);
                break;
                case 4:
                trnsformX = this.getColWidth()*(-4);
                break;
                case 5:
                trnsformX = this.getColWidth()*(-5);
                break;
                case 6:
                trnsformX = this.getColWidth()*(-6);
                break;
            }

            var afterXStr = setTransformXToMrx(slider.css('transform'), trnsformX);
            
            $('.frzTable-slider').css('transform', afterXStr);      


        }

   
        $.fn[ModuleName] = function ( methods, options ) {
            return this.each(function(){
                var $this = $(this);
                var module = $this.data( ModuleName );
                var opts = null;
                if ( !!module ) {
                    console.log(methods, typeof methods,typeof options);
                    if ( typeof methods === 'string' &&  typeof options === 'undefined' ) {
                        module[methods]();
                    } 
                    else if ( typeof methods === 'string' &&  (typeof options === 'object' || typeof options === 'function') ) {
                        module[methods](options);
                    } 
                    else {                       
                        console.log('unsupported options!');
                        throw 'unsupported options!';
                    }
                } else {
                    opts = $.extend( {}, Module.DEFAULT, ( typeof methods === 'object' && methods ), ( typeof options === 'object' && options ) );
                    module = new Module(this, opts);
                    $this.data( ModuleName, module );
                    module.whenClick = opts.whenClick;
                    module.init();

                    module.$frzTableCol.on('click',function(e){
                    	module.activeChange(this);
                        if (!!module.whenClick && typeof module.whenClick === 'function'){
                            module.whenClick(this);
                        }else{
                            console.log('whenClick is not a function');
                        }
                    })

                    var pos;
                    var slider = $('.frzTable-slider');
                    $('.frzTable-nextArrow').on('click', function(){                      
                        var ori = getOriXMrx(slider.css('transform'));
                        if( ori === 0 ){
                            pos = ori + module.option.count.slide;
                        }else if (pos > 0){
                            pos = pos + module.option.count.slide;
                        }
                        module.moveCol(pos);
                        $('.frzTable-preArrow').show();                       
                    });

                    $('.frzTable-preArrow').on('click', function(){                        
                        var ori = getOriXMrx(slider.css('transform'));
                        if( ori === 0 ){
                            $('.frzTable-preArrow').hide();
                        }else if (pos > 0){
                            pos = pos - module.option.count.slide ;
                        }                        
                        module.moveCol(pos);
                    });                 
                }
            });
        };

    
})(jQuery);
