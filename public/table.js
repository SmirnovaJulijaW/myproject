var getParameterData = function (elem) {
    return {
        Id: $(elem).children('.id').text(), 
        Name: $(elem).children('.name').text(),
        Description: $(elem).children('.description').text(),
        Value: $(elem).children('.value').text(),
        Type: $(elem).children('.type').text()
    }
}

var setType = function (type, value) {
    var val = value || '';
    $('#type').val(type);
    if (type == 'System.String') {
        $('#value-string').show().val(value);
        $('#value-int').hide();
        $('#value-boolean').hide();
    }
    else if (type == 'System.Int32') {
        $('#value-int').show().val(value);
        $('#value-string').hide();
        $('#value-boolean').hide();
    }

    else if (type == 'System.Boolean') {
        var checked = value == 'True' ? true: false;
        $('#value-boolean').prop('checked', checked).show();
        $('#value-string').hide();
        $('#value-int').hide();
    }
}

var getValue = function(type) {
    var result;
    if (type == 'System.Boolean')
        result = $('#value-boolean').prop('checked') ? 'True': 'False';
    else if (type == 'System.Int32')
        result = $('#value-int').val();
    else if (type == 'System.String')
        result = $('#value-string').val();
    return result;
}

$(document).ready(function () {

    $('#download').on('click', function () {
        var data = {Parameters: []};
        $("tr[id^='parameter']").each(function (index, elem) {
            var parameter = getParameterData(elem);
            data.Parameters.push(parameter);
        });
        $.ajax('/upload/', {
            type : 'POST',
            contentType : 'application/json',
            data : JSON.stringify(data),
            success: function (response) {
                var string = (new XMLSerializer()).serializeToString(response.documentElement);
                var blob = new Blob([string]);
                var link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = "Output.xml";
                link.click();
            }
        });
    });

    $('#append').on('click', function () {
        $('#formHeader').text('Создание нового элемента');
        $("#form").modal('show');
        $('#edit').val('');
        $('#id').val('');
        $('#name').val('');
        $('#description').val('');
        setType('System.String');
    });

    $("body").on('click', '.edit', function () {
        $('#formHeader').text('Редоктирование элемента');
        $("#form").modal('show');
        var tr = $(this).parent().parent();
        var data = getParameterData(tr);
        $('#id').val(data.Id);
        $('#name').val(data.Name);
        $('#description').val(data.Description);
        setType(data.Type, data.Value);
        $('#edit').val(tr.attr('id'));
    });

    $('body').on('click', '.remove', function () {
        $(this).parent().parent().remove();
    });

    $('#type').on('change', function () {
        var type = $(this).val();
        setType(type);
    });

    $('#save').on('click', function () {
        var id = $('#edit').val();
        var data = {
            Id: $('#id').val(),
            Name: $('#name').val(),
            Description: $('#description').val(),
            Value: getValue($('#type').val()),
            Type: $('#type').val()
        }
        if (id) {
            var tr = $('#' + id);
            tr.children('.id').text(data.Id);
            tr.children('.name').text(data.Name);
            tr.children('.description').text(data.Description);
            tr.children('.value').text(data.Value);
            tr.children('.type').text(data.Type);
        }
        else {
            var tr = $('<tr />', {'id': 'parameter-' + $("tr[id^='parameter']").length}).appendTo('#items')
            $('<td />', {'class': 'id'}).text(data.Id).appendTo(tr);
            $('<td />', {'class': 'name'}).text(data.Name).appendTo(tr);
            $('<td />', {'class': 'description'}).text(data.Description).appendTo(tr);
            $('<td />', {'class': 'value'}).text(data.Value).appendTo(tr);
            $('<td />', {'class': 'type'}).text(data.Type).appendTo(tr);
            $('<td><button class="edit btn btn-default btn-xs glyphicon glyphicon-pencil"></button><button class="remove btn btn-default btn-xs glyphicon glyphicon-remove"></button></td>').appendTo(tr)
        }
        $("#form").modal('hide');
    });
})