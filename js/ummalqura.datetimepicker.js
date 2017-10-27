/**
 * Ummalqura Datetimepicker Plugin
 * based on dwz.datepicker.js
 * Written by ZhangHuihua@msn.com
 * Modified by Bosco.fang to support UmmAlQura calendar
 * Please attribute the author if you use it.
 */
(function($){
	
	$.setRegional = function(key, value){
		if (!$.regional) $.regional = {};
		$.regional[key] = value;
	};
	var calc = $.calendars.instance('ummalqura');
	
	var DWZ = {
		keyCode: {
			ENTER: 13, ESC: 27, END: 35, HOME: 36,
			SHIFT: 16, TAB: 9,
			LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40,
			DELETE: 46, BACKSPACE:8
		}
	}
	$.setRegional("datepicker", {
		dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	});

	$.fn.datepicker = function(opts){
		var setting = {
			box$:"#calendar",
			year$:"#calendar [name=year]", month$:"#calendar [name=month]",
			tmInputs$:"#calendar .time :input[type='text']", hour$:"#calendar .time .hh", minute$:"#calendar .time .mm", second$:"#calendar .time .ss",
			tmBox$:"#calendar .tm", tmUp$:"#calendar .time .up", tmDown$:"#calendar .time .down",
			close$:"#calendar .close", calIcon$:"a.inputDateButton",
			main$:"#calendar .main", days$:"#calendar .days", dayNames$:"#calendar .dayNames",
			clearBut$:"#calendar .clearBut", okBut$:"#calendar .okBut",nowBut$:"#calendar .nowBut"
		};

		function changeTmMenu(sltClass){
			var $tm = $(setting.tmBox$);
			$tm.removeClass("hh").removeClass("mm").removeClass("ss");
			if (sltClass) {
				$tm.addClass(sltClass);
				$(setting.tmInputs$).removeClass("slt").filter("." + sltClass).addClass("slt");
			}
		}
		function clickTmMenu($input, type){
			$(setting.tmBox$).find("."+type+" li").each(function(){
				var $li = $(this);
				$li.click(function(){
					$input.val($li.text());
				});
			});
		}
		function keydownInt(e){
			if (!((e.keyCode >= 37 && e.keyCode <= 40)||(e.keyCode >= 48 && e.keyCode <= 57)||e.keyCode==9||(e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode == DWZ.keyCode.DELETE || e.keyCode == DWZ.keyCode.BACKSPACE))) { return false; }
		}
		function changeTm($input, type){
			var ivalue = parseInt($input.val()), istart = parseInt($input.attr("start")) || 0, iend = parseInt($input.attr("end"));
			var istep = parseInt($input.attr('step') || 1);
			if (type == 1) {
				if (ivalue <= iend-istep){$input.val(ivalue + istep);}
			} else if (type == -1){
				if (ivalue >= istart+istep){$input.val(ivalue - istep);}
			} else if (ivalue > iend) {
				$input.val(iend);
			} else if (ivalue < istart) {
				$input.val(istart);
			}
		}
				
		return this.each(function(){
			var $this = $(this);
			var dp = new Datepicker($this.val(), opts);
			function generateCalendar(dp){
				var dw = dp.getDateWrap();
				var minDate = dp.getMinDate();
				var maxDate = dp.getMaxDate();
				var monthStart = calc.newDate(dw.year,dw.month,1);
				var startDay = monthStart.dayOfWeek(); //the day of the week for the given date
				var dayStr="";
				if (startDay > 0){
					monthStart.month(monthStart._month - 1);
					var prevDateWrap = dp.getDateWrap(monthStart);
					for(var t=prevDateWrap.days-startDay+1;t<=prevDateWrap.days;t++) {
						var _date = calc.newDate(dw.year, dw.month-1, t);
						var _ctrClass = (_date >= minDate && _date <= maxDate) ? '' : 'disabled';
						dayStr+='<dd class="other '+_ctrClass+'" chMonth="-1" day="' + t + '">'+t+'</dd>';
					}
				}
				for(var t=1;t<=dw.days;t++){
					var _date = calc.newDate(dw.year, dw.month, t);
					var _ctrClass = (_date >= minDate && _date <= maxDate) ? '' : 'disabled';
					if(t==dw.day){
						dayStr+='<dd class="slt '+_ctrClass+'" day="' + t + '">'+t+'</dd>';
					}else{
						dayStr+='<dd class="'+_ctrClass+'" day="' + t + '">'+t+'</dd>';
					}
				}
				for(var t=1;t<=42-startDay-dw.days;t++){
					var _date = calc.newDate(dw.year, dw.month+1, t);
					var _ctrClass = (_date >= minDate && _date <= maxDate) ? '' : 'disabled';
					dayStr+='<dd class="other '+_ctrClass+'" chMonth="1" day="' + t + '">'+t+'</dd>';
				}
				
				var $days = $(setting.days$).html(dayStr).find("dd");
				$days.not('.disabled').click(function(){
					var $day = $(this);
					if (!dp.hasTime()) {
						$this.val(dp.formatDate(dp.changeDay($day.attr("day"), $day.attr("chMonth"))));
						closeCalendar(); 
						$this.change() // 扩展,调用 绑定 日期控件的change 方法
					} else {
						$days.removeClass("slt");
						$day.addClass("slt");
					}
				});

				if (!dp.hasDate()) $(setting.main$).addClass('nodate'); // 仅时间，无日期
				
				if (dp.hasTime()) {
					$("#calendar .time").show();
					
					var $hour = $(setting.hour$).val(dw.hour).focus(function(){
						changeTmMenu("hh");
					});
					var iMinute = parseInt(dw.minute / dp.opts.mmStep) * dp.opts.mmStep;
					var $minute = $(setting.minute$).val(iMinute).attr('step',dp.opts.mmStep).focus(function(){
						changeTmMenu("mm");
					});
					var $second = $(setting.second$).val(dp.hasSecond() ? dw.second : 0).attr('step',dp.opts.ssStep).focus(function(){
						changeTmMenu("ss");
					});
					
					$hour.add($minute).add($second).click(function(){return false});
					
					clickTmMenu($hour,"hh");
					clickTmMenu($minute,"mm");
					clickTmMenu($second,"ss");
					$(setting.box$).click(function(){
						changeTmMenu();
					});
					
					var $inputs = $(setting.tmInputs$);
					$inputs.keydown(keydownInt).each(function(){
						var $input = $(this);
						$input.keyup(function(){
							changeTm($input, 0);
						});
					});
					$(setting.tmUp$).click(function(){
						$inputs.filter(".slt").each(function(){
							changeTm($(this), 1);
						});
					});
					$(setting.tmDown$).click(function(){
						$inputs.filter(".slt").each(function(){
							changeTm($(this), -1);
						});
					});
					
					if (!dp.hasHour()) $hour.attr("disabled",true);
					if (!dp.hasMinute()) $minute.attr("disabled",true);
					if (!dp.hasSecond()) $second.attr("disabled",true);
				}
				
			}
			
			function closeCalendar() {
				$(setting.box$).remove();
				$(document).unbind("click", closeCalendar);
			}

			$this.click(function(event){
				closeCalendar();
				var dp = new Datepicker($this.val(), opts);
				var offset = $this.offset();
				var iTop = offset.top+this.offsetHeight;
				var temp = '';
				temp+='<div id="calendar">';
				temp+='	<div class="main">';
				temp+='		<div class="head">';
				temp+='			<table width="100%" border="0" cellpadding="0" cellspacing="2">';
				temp+='			<tr>';
				temp+='				<td><select name="year"></select></td>';
				temp+='				<td><select name="month"></select></td>';
				temp+='				<td width="20"><span class="close">×</span></td>';
				temp+='			</tr>';
				temp+='			</table>';
				temp+='		</div>';
				temp+='		<div class="body">'
				temp+='			<dl class="dayNames"><dt>Sun</dt><dt>Mon</dt><dt>Tue</dt><dt>Wed</dt><dt>Thu</dt><dt>Fri</dt><dt>Sat</dt></dl>';
				temp+='			<dl class="days">日期列表选项</dl>';
				temp+='			<div style="clear:both;height:0;line-height:0"></div>';
				temp+='		</div>';
				temp+='		<div class="foot">';
				temp+='			<table class="time">';
				temp+='				<tr>';
				temp+='					<td>';
				temp+='						<input type="text" class="hh" maxlength="2" start="0" end="23"/>:';
				temp+='						<input type="text" class="mm" maxlength="2" start="0" end="59"/>:';
				temp+='						<input type="text" class="ss" maxlength="2" start="0" end="59"/>';
				temp+='					</td>';
				temp+='					<td><ul><li class="up">&and;</li><li class="down">&or;</li></ul></td>';
				temp+='				</tr>';
				temp+='			</table>';
				temp+='			<button type="button" class="nowBut">'+"Ct"+'</button>';
				temp+='			<button type="button" class="clearBut">'+"Del"+'</button>';
				temp+='			<button type="button" class="okBut">'+"OK"+'</button>';
				temp+='		<div>';
				temp+='		<div class="tm">';
				temp+='			<ul class="hh">';
				temp+='				<li>0</li>';
				temp+='				<li>1</li>';
				temp+='				<li>2</li>';
				temp+='				<li>3</li>';
				temp+='				<li>4</li>';
				temp+='				<li>5</li>';
				temp+='				<li>6</li>';
				temp+='				<li>7</li>';
				temp+='				<li>8</li>';
				temp+='				<li>9</li>';
				temp+='				<li>10</li>';
				temp+='				<li>11</li>';
				temp+='				<li>12</li>';
				temp+='				<li>13</li>';
				temp+='				<li>14</li>';
				temp+='				<li>15</li>';
				temp+='				<li>16</li>';
				temp+='				<li>17</li>';
				temp+='				<li>18</li>';
				temp+='				<li>19</li>';
				temp+='				<li>20</li>';
				temp+='				<li>21</li>';
				temp+='				<li>22</li>';
				temp+='				<li>23</li>';
				temp+='			</ul>';
				temp+='			<ul class="mm">';
				temp+='				<li>0</li>';
				temp+='				<li>5</li>';
				temp+='				<li>10</li>';
				temp+='				<li>15</li>';
				temp+='				<li>20</li>';
				temp+='				<li>25</li>';
				temp+='				<li>30</li>';
				temp+='				<li>35</li>';
				temp+='				<li>40</li>';
				temp+='				<li>45</li>';
				temp+='				<li>50</li>';
				temp+='				<li>55</li>';
				temp+='			</ul>';
				temp+='			<ul class="ss">';
				temp+='				<li>0</li>';
				temp+='				<li>10</li>';
				temp+='				<li>20</li>';
				temp+='				<li>30</li>';
				temp+='				<li>40</li>';
				temp+='				<li>50</li>';
				temp+='			</ul>';
				temp+='		</div>';
				temp+='	</div>';
				temp+='</div>';


				$(temp).appendTo("body").css({
					left:offset.left+'px',
					top:iTop+'px'
				}).show().click(function(event){
					event.stopPropagation();
				});
				
				($.fn.bgiframe && $(setting.box$).bgiframe());
				
				var dayNames = "";
				$.each($.regional.datepicker.dayNames, function(i,v){
					dayNames += "<dt>" + v + "</dt>"
				});
				$(setting.dayNames$).html(dayNames);
				
				var dw = dp.getDateWrap();
				var $year = $(setting.year$);
				var yearstart = dp.getMinDate()._year;
				var yearend = dp.getMaxDate()._year;
				for(y=yearstart; y<=yearend; y++){
					$year.append('<option value="'+ y +'"'+ (dw.year==y ? 'selected="selected"' : '') +'>'+ y +'</option>');
				}
				var $month = $(setting.month$);
				$.each($.regional.datepicker.monthNames, function(i,v){
					var m = i+1;
					$month.append('<option value="'+ m +'"'+ (dw.month==m ? 'selected="selected"' : '') +'>'+ v +'</option>');
				});
				
				// generate calendar
				generateCalendar(dp);
				$year.add($month).change(function(){
					dp.changeDate($year.val(), $month.val());
					generateCalendar(dp);
				});
				
				// fix top
				var iBoxH = $(setting.box$).outerHeight(true);
				if (iTop > iBoxH && iTop > $(window).height()-iBoxH) {
					$(setting.box$).css("top", offset.top - iBoxH);
				}
				
				$(setting.close$).click(function(){
					closeCalendar();
				});
				$(setting.clearBut$).click(function(){
					$this.val("");
					closeCalendar();
				});
				
				$(setting.okBut$).click(function(){
					var $dd = $(setting.days$).find("dd.slt");
					
					if ($dd.hasClass("disabled")) return false;
					var date = dp.changeDay($dd.attr("day"), $dd.attr("chMonth"));
					if (dp.hasDate()){
						date.year(parseInt($(setting.year$).val()));
					}
					if (dp.hasTime()) {
					 	date.hour(parseInt($(setting.hour$).val()));
						date.minute(parseInt($(setting.minute$).val()));
						date.second(parseInt($(setting.second$).val()));
					}
					
					$this.val(dp.formatDate(date));
					closeCalendar();
					$this.change() // 扩展,调用 绑定 日期控件的change 方法
				});
				
				$(setting.nowBut$).click(function(){
					var nowDate = calc.today();
					var dp = new Datepicker(nowDate.formatDate("yyyy-MM-dd HH:mm:ss"), opts);
					$(setting.year$).val(nowDate._year);
					$(setting.month$).val(nowDate._month);
					generateCalendar(dp);
				});
				$(document).bind("click", closeCalendar);
				$("#id_model_extend a").bind("click",closeCalendar );
				return false;
			});
			
			$this.parent().find(setting.calIcon$).click(function(){
				$this.trigger("click");
				return false;
			});
		});
		
	}

	var Datepicker = function(sDate, opts) {
		this.opts = $.extend({
			pattern:'yyyy-MM-dd',
			mmStep:1,
			ssStep:1
		}, opts);
		
		//动态minDate、maxDate
		this.calc = $.calendars.instance('ummalqura');
		this.opts.minDate = this.calc.newDate(1400,01,01);
		this.opts.maxDate = this.calc.newDate(1499,01,01);
		
		this.sDate = sDate.trim();
	}
	
	$.extend(Datepicker.prototype, {
		get: function(name) {
			return this.opts[name];
		},
		_getDays: function (y,m){//获取某年某月的天数
			return this.calc.daysInMonth(y,m)
		},
		getMinDate: function(){
			return this.opts.minDate
		},
		getMaxDate: function(){
			return this.opts.maxDate
		},
		getDateWrap: function(date){ //得到年,月,日
			if (!date) date = this.parseDate(this.sDate) || this.calc.today();
			var y = parseInt(date._year);
			var m = parseInt(date._month);
			var d = parseInt(date._day);
			var days = this._getDays(y,m);
			return {
				year:y, month:m, day:d,
				hour:date.hour(),minute:date.minute(),second:date.second(),
				days: days, date:date
			}
		},
		changeDate: function(y, m, d){
			var date;
			if (m === 0){
				date = this.calc.newDate(y-1, 12, d || 1);
			}else{
				date = this.calc.newDate(y, m, d || 1);
			}
			this.sDate = this.formatDate(date);
			return date;
		},
		changeDay: function(day, chMonth){
			if (!chMonth) chMonth = 0;
			var dw = this.getDateWrap();
			return this.changeDate(dw.year, dw.month+parseInt(chMonth), parseInt(day));
		},
		parseDate: function(sDate){
			if (!sDate) return null;
			return sDate.parseDate(this.opts.pattern);
		},
		formatDate: function(date){
			return date.formatDate(this.opts.pattern);
		},
		hasHour: function() {
			return this.opts.pattern.indexOf("H") != -1;
		},
		hasMinute: function() {
			return this.opts.pattern.indexOf("m") != -1;
		},
		hasSecond: function() {
			return this.opts.pattern.indexOf("s") != -1;
		},
		hasTime: function() {
			return this.hasHour() || this.hasMinute() || this.hasSecond();
		},
		hasDate: function() {
			var _dateKeys = ['y','M','d','E'];
			for (var i=0; i<_dateKeys.length; i++){
				if (this.opts.pattern.indexOf(_dateKeys[i]) != -1) return true;
			}

			return false;
		}
	});
})(jQuery);
 