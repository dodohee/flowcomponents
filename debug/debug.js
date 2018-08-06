exports.id = 'debug';
exports.title = 'Debug';
exports.author = 'Peter Širka';
exports.color = '#967ADC';
exports.click = true;
exports.input = true;
exports.icon = 'bug';
exports.version = '2.0.1';
exports.options = { enabled: true, repository: false, type: 'data', logger: false };
exports.readme = `# Debug

Prints data to the debug tab.`;

exports.html = `<div class="padding">
	<div class="row">
		<div class="col-md-12">
			<div data-jc="dropdown" data-jc-path="type" data-jc-config="items:Message data|data,Message repository|repository,Message data + Message repository|both;required:true" class="m">@(Output type)</div>
			<div data-jc="textbox" data-jc-path="property" data-jc-config="placeholder: @(e.g. address.street)" class="m">@(Path to the property (leave empty to show the whole data object))</div>
			<div data-jc="textbox" data-jc-path="group" data-jc-config="placeholder: @(e.g. Temperature)" class="m">@(A group name)</div>
			<div data-jc="checkbox" data-jc-path="enabled">@(Enabled)</div>
			<div data-jc="checkbox" data-jc-path="logger">@(Log received messages into the file)</div>
		</div>
	</div>
</div>`;

exports.install = function(instance) {
	instance.on('data', function(response) {
		if (instance.options.enabled) {
			var val;
			switch (instance.options.type){
				case 'both':
					var data = {};
					data.repository = response.repository;
					data.data = response.data;
					val = instance.options.property ? U.get(data, instance.options.property) : data, undefined, instance.options.group;
					instance.debug(val);
					break;
				case 'repository':
					val = instance.options.property ? U.get(response.repository, instance.options.property) : response.repository, undefined, instance.options.group;
					instance.debug(val);
					break;
				case 'data':
				default:
					val = instance.options.property ? U.get(response.data, instance.options.property) : response, undefined, instance.options.group;
					instance.debug(val);
					break;
			}
			instance.options.logger && LOGGER('flowdebug', instance.name + ':', val.data !== undefined ? val.data : val);
		}
	});

	instance.on('click', function() {
		instance.options.enabled = !instance.options.enabled;
		instance.custom.status();
		instance.save();
	});

	instance.on('options', function() {
		instance.custom.status();
	});

	instance.custom.status = function() {
		instance.status(instance.options.enabled ? 'Enabled' : 'Disabled');
	};

	instance.custom.status();
};
