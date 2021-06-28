
var num = String.raw`(-?\d+(?:\.\d+)?)`;
var re = new RegExp(String.raw`_([\w]+) (\d+) palias ?# ?${num} - ${num},? ?${num}? ?\(?([\w]+)?\)?`, 'g');
var setP = function(i, p)
{
	if (typeof sporthem_setp !== 'undefined') sporthem_setp(i, p);
}

var checkPIdx = function(pidx = '')
{
	var nPIdx = Number(pidx);
	return (nPIdx >= 0 && nPIdx <= 15)
}

var createSlider = function(container, param, values)
{
	var paramDiv = document.createElement("div");
	paramDiv.className = "sliderOut";
	
	var label = document.createElement("div");
	label.innerHTML = param.name + ":" + param.index + ":";
	label.className = "sliderLabel";
	paramDiv.appendChild(label);
	
	var slider = document.createElement("input");
	slider.type = "range";
	slider.min = param.min;
	slider.max = param.max;
	slider.step = (param.max - param.min) / 1000;
	slider.className = "sliderRange";

	paramDiv.appendChild(slider);
	if (!checkPIdx(param.index)) {
		slider.setAttribute('disabled', true);
		slider.setAttribute('title', `index(0..15) out of range: ${param.index}`);
	}
	
	var displ = document.createElement("div");
	displ.innerHTML = param.value + ' ' + param.units;
	displ.className = "sliderDispl";
	paramDiv.appendChild(displ);
	
	container.appendChild(paramDiv);
	
	slider.addEventListener('input', function(event) {
		values[param.name] = slider.value;
		setP(param.index, slider.value);
		displ.innerHTML = slider.value + ' ' + param.units;
	});
	
	slider.value = param.value;
	values[param.name] = slider.value;
}

function sporthParam_createSliders(container, script, values = {})
{
	container.innerHTML = '';
	while(true) {
		var match = re.exec(script);
		if (!match) break;
		var param = {
			name: match[1],
			index: match[2],
			min: match[3],
			max: match[4],
		};
		if (values[param.name] !== undefined)
			param.value = values[param.name];
		else if (match[5] !== undefined)
			param.value = match[5];
		else
			param.value = param.min;
		param.units = (match[6] !== undefined) ? match[6] : '';
		createSlider(container, param, values);
	}
	return values;
}

function sporthParam_setPvalues(script, values)
{
	while(true) {
		var match = re.exec(script);
		if (!match) break;
		var param = {
			name: match[1],
			index: match[2],
			min: match[3],
			max: match[4],
		};
		if (values[param.name] !== undefined)
			param.value = values[param.name];
		else if (match[5] !== undefined)
			param.value = match[5];
		else
			param.value = param.min;
		if (checkPIdx(param.index)) {
			setP(param.index, param.value);
		} else {
			console.error(`palias: index(0..15): out of range: ${param.index}`);
		}
	}
}
