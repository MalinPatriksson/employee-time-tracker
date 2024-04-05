$(document).ready(function () {
    var employeesData = [];

    // Definiera en array med månader och antal arbetsdagar
    var monthsWithWorkdays = [
        { name: "Januari", workdays: 22 },
        { name: "Februari", workdays: 21 },
        { name: "Mars", workdays: 19 },
        { name: "April", workdays: 20 },
        { name: "Maj", workdays: 20 },
        { name: "Juni", workdays: 20 },
        { name: "Juli", workdays: 20 },
        { name: "Augusti", workdays: 19 },
        { name: "September", workdays: 19 },
        { name: "Oktober", workdays: 22 },
        { name: "November", workdays: 22 },
        { name: "December", workdays: 18 }
    ];

    // Loopa genom arrayen och lägg till bara de månader som har arbetsdagar till dropdown-menyn
    var monthDropdown = $('#month');
    $.each(monthsWithWorkdays, function (index, month) {
        if (month.workdays > 0) {
            monthDropdown.append($('<option>').text(month.name));
        }
    });

    // Definiera en array med anställda
    var employees = ["Christian Green", "Christer Klingberg", "Per Renntun", "Jenny Dolderer", "Anders Patriksson"];

    // Loopa genom arrayen och lägg till varje anställd till dropdown-menyn
    var employeeDropdown = $('#employee');
    $.each(employees, function (index, employee) {
        employeeDropdown.append($('<option>').text(employee));
    });

    $('#calculate').click(function () {
        let month = $('#month').val();
        let employee = $('#employee').val();
        let hoursWorked = $('#hoursWorked').val();

        // Hämta det senaste beräknade data för den valda användaren
        let lastData = employeesData.length > 0 ? employeesData[employeesData.length - 1] : null;

        if (month !== '' && employee !== '' && hoursWorked !== '') {
            // Om det senaste beräknade användardata är null eller om den valda användaren är annorlunda än den senaste beräknade användaren
            if (lastData === null || lastData.name !== employee) {
                let daysInMonth = getDaysInMonth(month);
                let totalHours = getTotalHoursForMonth(month, daysInMonth);
                let belaggning = calculateBelaggning(hoursWorked, totalHours);

                // Spara data för den beräknade personen
                employeesData.push({ name: employee, hoursWorked: hoursWorked, belaggning: belaggning });

                // Visa bekräftelsemeddelande
                $('#confirmationMessage').text('Beräkningen är klar.').removeClass('alert-danger').addClass('alert-success').fadeIn().delay(2000).fadeOut();
                hoursWorked = $('#hoursWorked').val('');
            } else {
                // Visa rött meddelande om samma person väljs igen
                $('#confirmationMessage').text('Välj en annan person.').removeClass('alert-success').addClass('alert-danger').fadeIn().delay(2000).fadeOut();
            }
        } else {
            // Visa rött meddelande om något fält inte är ifyllt
            $('#confirmationMessage').text('Fyll i alla fält.').removeClass('alert-success').addClass('alert-danger').fadeIn().delay(2000).fadeOut();
        }
    });

    $('#showSummary').click(function () {
        var summaryHTML = '<h1>Sammanställning för ' + $('#month').val() + '</h1>';
        summaryHTML += '<ul>';
        employeesData.forEach(function (employee) {
            summaryHTML += '<p><strong>Namn:</strong> ' + employee.name + '<br>';
            summaryHTML += '<strong>Timmar arbetade:</strong> ' + employee.hoursWorked + '<br>';
            summaryHTML += '<strong>Beläggning:</strong> ' + employee.belaggning.toFixed(2) + '%</p><br>';
        });
        $('#summary').html(summaryHTML);
        $('#downloadExcel').show();
    });

    $('#downloadExcel').click(async function () {
        var month = $('#month').val(); // Hämta den valda månaden
        var fileName = 'sammanställning - ' + month + '.xlsx'; // Skapa ett filnamn baserat på månaden
    
        // Skapa en ny arbetsbok
        var workbook = await XlsxPopulate.fromBlankAsync();
    
        const sheet = workbook.sheet(0);
    
        // Beräkna totala arbetade timmar och beläggningens procentandel för alla anställda
        var totalHoursWorked = 0;
        var totalBelaggning = 0;
        employeesData.forEach(function (employee) {
            totalHoursWorked += parseFloat(employee.hoursWorked);
            totalBelaggning += parseFloat(employee.belaggning);
        });
    
        // Lägg till rubriker för data i Excel-filen och formatera dem som fetstil
        sheet.cell("A1").value("Anställd").style({ bold: true });
        sheet.cell("B1").value("Timmar arbetade").style({ bold: true });
        sheet.cell("C1").value("Beläggning (%)").style({ bold: true });
    
        // Lägg till data för varje anställd i Excel-filen och formatera timmar arbetade som tal
        employeesData.forEach(function (employee, index) {
            sheet.cell(`A${index + 2}`).value(employee.name);
            sheet.cell(`B${index + 2}`).value(parseFloat(employee.hoursWorked)); // Konvertera till tal för att undvika textformat
            sheet.cell(`C${index + 2}`).value(employee.belaggning.toFixed(2));
        });
    
        // Lägg till totala värden för alla anställda i Excel-filen och formatera dem som fetstil
        var totalRow = employeesData.length + 2; // Anta att den totala raden är efter den sista anställdas rad
        sheet.cell(`A${totalRow}`).value("Totalt").style({ bold: true });
        sheet.cell(`B${totalRow}`).value(totalHoursWorked).style({ bold: true });
        sheet.cell(`C${totalRow}`).value((totalBelaggning / employeesData.length).toFixed(2)).style({ bold: true }); // Genomsnittlig beläggning för alla anställda
    
        // Beräkna antalet tillgängliga timmar för den valda månaden
        var availableHours = getAvailableHoursForMonth(month);
        
        // Visa antalet tillgängliga timmar i Excel-filen
        sheet.cell(`A${totalRow + 1}`).value("Tillgängliga timmar").style({ bold: true });
        sheet.cell(`B${totalRow + 1}`).value(availableHours).style({ bold: true });
    
        // Skapa en data-URL från arbetsboken
        var dataURL = await workbook.outputAsync();
    
        // Skapa en länk för att ladda ner filen med det dynamiska filnamnet
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(new Blob([dataURL], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        link.download = fileName; // Använd det dynamiska filnamnet
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // En funktion för att beräkna antalet tillgängliga timmar för en viss månad
    function getAvailableHoursForMonth(month) {
        // Hämta antalet arbetsdagar för den valda månaden
        var daysInMonth = getDaysInMonth(month);

        // Beräkna det totala antalet tillgängliga timmar för månaden
        var availableHours = daysInMonth * 8 * employees.length; // Antag att en arbetsdag är 8 timmar och multiplicera med antalet anställda

        // Beräkna totala arbetade timmar för månaden
        var totalHoursWorked = 0;
        employeesData.forEach(function (employee) {
            totalHoursWorked += parseFloat(employee.hoursWorked);
        });

        // Beräkna antalet timmar kvar eller överstigit
        var remainingHours = availableHours - totalHoursWorked;

        return remainingHours;
    }

    // Funktion för att beräkna beläggning
    function calculateBelaggning(hoursWorked, totalHours) {
        // Implementera beräkningslogiken här
        return (hoursWorked / totalHours) * 100;
    }

    // En funktion för att hämta antalet arbetsdagar i en viss månad
    function getDaysInMonth(month) {
        switch (month) {
            case "Januari":
                return 22;
            case "Februari":
                return 21;
            case "Mars":
                return 19;
            case "April":
                return 20;
            case "Maj":
                return 20;
            case "Juni":
                return 20;
            case "Juli":
                return 20;
            case "Augusti":
                return 19;
            case "September":
                return 19;
            case "Oktober":
                return 22;
            case "November":
                return 22;
            case "December":
                return 18;
            default:
                return 0; // Returnera 0 om månaden inte hittades
        }
    }

    // En funktion för att beräkna totala arbetstimmar för en månad
    function getTotalHoursForMonth(month, daysInMonth) {
        // Här kan du implementera logiken för att beräkna totala arbetstimmar för den angivna månaden baserat på antalet arbetsdagar.
        // Till exempel, om en heltidstjänst är 8 timmar per arbetsdag, multiplicera antalet arbetsdagar med 8 för att få totala timmar.
        return daysInMonth * 8; // Antag att en arbetsdag är 8 timmar
    }

    // Lyssna på klickhändelse för nollställningsknappen
    $('#reset').click(function () {
        // Återställ alla fält till deras standardvärden
        employeesData = [];
        $('#month').val('Januari');
        $('#employee').val(employees);
        $('#hoursWorked').val('');
        $('#summary').empty();
        $('#confirmationMessage').hide(); // Dölj bekräftelsemeddelandet
        $('#downloadExcel').hide();
    });

    // Visa lösenordsrutan när användaren klickar på knappen
    $('#showLoginForm').click(function () {
        $('#loginForm').show();
        $('#loginOverlay').show();
    });

    // Dölj lösenordsrutan när användaren loggar in
    $('#submitButton').click(function () {
        var username = $('#username').val();
        var password = $('#password').val();
        // Här kan du lägga till din inloggningslogik för att kontrollera användarnamn och lösenord
        // Om inloggningen är framgångsrik, dölj lösenordsrutan och visa innehållet
        if (username === 'admin' && password === 'password') {
            $('#loginForm').hide();
            $('#loginOverlay').hide();
            $('#content').show();
        } else {
            // Visa ett meddelande om inloggningen misslyckas
            alert('Fel användarnamn eller lösenord. Försök igen.');
        }
    });
});
