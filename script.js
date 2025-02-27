$(document).ready(function () {
    var employeesData = [];
    var employees = ["Christian Green", "Christer Klingberg", "Ellinor Engström", "Mikael Lundén", "Jenny Dolderer", "Per Renntun", "Jonathan Tinworth"];

    // Här fyller du dropdownen för tidsperiod med alternativ
    var intervalDropdown = $('#intervalDropdown');
    intervalDropdown.append($('<option>').text('Välj tidsperiod').val('')); // Tom förvaltning
    intervalDropdown.append($('<option>').text('Månad').val('month'));
    intervalDropdown.append($('<option>').text('Vecka').val('week'));

    // Dölj månads- och veckodropdowns initialt
    $('#employeeFormGroup').hide();
    $('#monthFormGroup').hide();
    $('#weekFormGroup').hide();

    // Definiera en array med månader och antal arbetsdagar
    // Array med månader och antal arbetsdagar
var monthsWithWorkdays = [
    { name: "Januari", workdays: 21 },
    { name: "Februari", workdays: 20 },
    { name: "Mars", workdays: 21 },
    { name: "April", workdays: 20 },
    { name: "Maj", workdays: 20 },
    { name: "Juni", workdays: 19 },
    { name: "Juli", workdays: 23 },
    { name: "Augusti", workdays: 21 },
    { name: "September", workdays: 22 },
    { name: "Oktober", workdays: 23 },
    { name: "November", workdays: 20 },
    { name: "December", workdays: 19 }
];

// Array med månader, veckor och antal arbetsdagar
var monthsWithWeeks = [
    { name: "Januari", weeks: [{ week: 1, workdays: 3 }, { week: 2, workdays: 5 }, { week: 3, workdays: 5 }, { week: 4, workdays: 5 }, { week: 5, workdays: 3 }] },
    { name: "Februari", weeks: [{ week: 5, workdays: 2 }, { week: 6, workdays: 5 }, { week: 7, workdays: 5 }, { week: 8, workdays: 5 }, { week: 9, workdays: 3 }] },
    { name: "Mars", weeks: [{ week: 9, workdays: 2 }, { week: 10, workdays: 5 }, { week: 11, workdays: 5 }, { week: 12, workdays: 5 }, { week: 13, workdays: 4 }] },
    { name: "April", weeks: [{ week: 14, workdays: 4 }, { week: 15, workdays: 5 }, { week: 16, workdays: 5 }, { week: 17, workdays: 5 }, { week: 18, workdays: 1 }] },
    { name: "Maj", weeks: [{ week: 18, workdays: 1 }, { week: 19, workdays: 4 }, { week: 20, workdays: 5 }, { week: 21, workdays: 5 }, { week: 22, workdays: 5 }] },
    { name: "Juni", weeks: [{ week: 23, workdays: 4 }, { week: 24, workdays: 5 }, { week: 25, workdays: 4 }, { week: 26, workdays: 5 }] },
    { name: "Juli", weeks: [{ week: 27, workdays: 5 }, { week: 28, workdays: 5 }, { week: 29, workdays: 5 }, { week: 30, workdays: 5 }, { week: 31, workdays: 3 }] },
    { name: "Augusti", weeks: [{ week: 31, workdays: 2 }, { week: 32, workdays: 5 }, { week: 33, workdays: 5 }, { week: 34, workdays: 5 }, { week: 35, workdays: 4 }] },
    { name: "September", weeks: [{ week: 36, workdays: 5 }, { week: 37, workdays: 5 }, { week: 38, workdays: 5 }, { week: 39, workdays: 5 }, { week: 40, workdays: 2 }] },
    { name: "Oktober", weeks: [{ week: 40, workdays: 3 }, { week: 41, workdays: 5 }, { week: 42, workdays: 5 }, { week: 43, workdays: 5 }, { week: 44, workdays: 5 }] },
    { name: "November", weeks: [{ week: 45, workdays: 5 }, { week: 46, workdays: 5 }, { week: 47, workdays: 5 }, { week: 48, workdays: 5 }] },
    { name: "December", weeks: [{ week: 49, workdays: 5 }, { week: 50, workdays: 5 }, { week: 51, workdays: 5 }, { week: 52, workdays: 4 }] }
];



    // När en månad väljs, fyll veckodropdownen med veckor för den valda månaden
    $('#month').change(function () {
        var selectedMonth = $(this).val();
        $('#week').empty(); // Rensa veckodropdownen
        $.each(monthsWithWeeks, function (index, month) {
            if (month.name === selectedMonth) {
                $.each(month.weeks, function (index, week) {
                    $('#week').append($('<option>').text(selectedMonth + ', vecka ' + week.week).val(week.week)); // Uppdatering här
                });
            }
        });
    });

    // Visa antingen månads- eller veckodropdownen baserat på användarens val
    intervalDropdown.change(function () {
        var selectedInterval = $(this).val();
        // Dölj månads- och veckodropdowns initialt
        $('#monthFormGroup').hide();
        $('#weekFormGroup').hide();
        $('#employeeFormGroup').show();
        if (selectedInterval === "month") {
            $('#month').val('');
            $('#employee').val(employees); // Antar att den första anställda är på index 0 i listan
            $('#monthFormGroup').show();
        } else if (selectedInterval === "week") {
            $('#month').val('');
            $('#employeeFormGroup').show();
            $('#monthFormGroup').show(); // Visa månadsväljaren när "Vecka" väljs
            $('#weekFormGroup').show(); // Visa veckoväljaren när "Vecka" väljs
            $('#employee').val(employees); // Antar att den första anställda är på index 0 i listan

        }
    });

    // Loopa genom arrayen och lägg till bara de månader som har arbetsdagar till dropdown-menyn
    var monthDropdown = $('#month');
    $.each(monthsWithWorkdays, function (index, month) {
        if (month.workdays > 0) {
            monthDropdown.append($('<option>').text(month.name));
        }
    });

    // Loopa genom arrayen och lägg till varje anställd till dropdown-menyn
    var employeeDropdown = $('#employee');
    $.each(employees, function (index, employee) {
        employeeDropdown.append($('<option>').text(employee));
    });

       // Funktion för att uppdatera både dropdown och listan med radera-knappar
    function updateEmployeeLists() {
    var employeeDropdown = $('#employee');
    var employeeList = $('#employeeList');

    // Rensa både dropdown och listan
    employeeDropdown.empty();
    employeeList.empty();

    $.each(employees, function (index, employee) {
        // Lägg till i dropdown-menyn
        employeeDropdown.append($('<option>').text(employee));

        // Lägg till i radera-listan
        var listItem = $('<li class="list-group-item d-flex justify-content-between align-items-center">')
            .text(employee)
            .append(
                $('<button class="btn btn-danger btn-sm ms-2">🗑️</button>').click(function () {
                    employees.splice(index, 1);
                    updateEmployeeLists(); // Uppdatera båda listorna när en anställd tas bort
                })
            );

        employeeList.append(listItem);
    });
}

// Lägg till ny anställd och uppdatera båda listorna
$('#addEmployee').click(function () {
    var newEmployee = $('#newEmployee').val().trim();
    if (newEmployee !== "" && !employees.includes(newEmployee)) {
        employees.push(newEmployee);
        updateEmployeeLists();
        $('#newEmployee').val(''); // Rensa inputfältet
    }
});

// Uppdatera listor när sidan laddas
updateEmployeeLists();



    // När en vecka väljs, beräkna beläggningen för den valda veckan
    $('#week').change(function () {
        var selectedWeek = $(this).val();
        var selectedMonth = $('#month').val();

        var occupancyPercentage = calculateOccupancyForWeek(selectedMonth, selectedWeek);

        // Uppdatera beläggningen för den valda veckan i gränssnittet
        $('#occupancy').val(occupancyPercentage + '%');
    });

    $('#calculate').click(function () {
        let month = $('#month').val();
        let selectedInterval = $('#intervalDropdown').val();
        let employee = $('#employee').val();
        let hoursWorked = $('#hoursWorked').val();
        let selectedWeek = $('#week').val();

        // Hämta det senaste beräknade data för den valda användaren
        let lastData = employeesData.length > 0 ? employeesData[employeesData.length - 1] : null;

        if (month !== '' && employee !== '' && hoursWorked !== '') {
            // Kontrollera om intervallet är vecka och om veckoval är ifyllt
            if (selectedInterval === 'week' && selectedWeek === '') {
                // Visa ett rött meddelande om veckoval inte är ifyllt
                $('#confirmationMessage').text('Välj en vecka.').removeClass('alert-success').addClass('alert-danger').fadeIn().delay(2000).fadeOut();
                return; // Avbryt funktionen om veckoval inte är ifyllt
            }

            // Om det senaste beräknade användardata är null eller om den valda användaren är annorlunda än den senaste beräknade användaren
            if (lastData === null || lastData.name !== employee) {
                if (selectedInterval === 'month') {
                    let daysInMonth = getDaysInMonth(month);
                    let totalHours = getTotalHoursForMonth(month, daysInMonth);
                    let belaggning = calculateBelaggning(hoursWorked, totalHours);
                    // Spara data för den beräknade personen
                    employeesData.push({ name: employee, hoursWorked: hoursWorked, belaggning: belaggning });
                } else if (selectedInterval === 'week') {
                    let workdaysInWeek = getWorkdaysInWeek(month, selectedWeek);
                    let totalHoursInWeek = workdaysInWeek * 8; // Antalet arbetsdagar * antal timmar per dag
                    let belaggning = calculateBelaggning(hoursWorked, totalHoursInWeek);
                    // Spara data för den beräknade personen
                    employeesData.push({ name: employee, hoursWorked: hoursWorked, belaggning: belaggning });
                }

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
    var selectedInterval = $('#intervalDropdown').val();
    var selectedMonth = $('#month').val();
    var selectedWeek = $('#week').val();
    var summaryHTML = '<h1>';

    if (selectedInterval === 'month') {
        summaryHTML += 'Sammanställning för ' + selectedMonth;
    } else if (selectedInterval === 'week') {
        summaryHTML += 'Sammanställning för ' + selectedMonth + ', vecka ' + selectedWeek;
    }

    summaryHTML += '</h1><ul>';

    var totalHoursWorked = 0;
    var totalBelaggning = 0;
    var employeeCount = employeesData.length;

    if (selectedInterval === 'month') {
        // Sammanställning för månaden
        employeesData.forEach(function (employee) {
            summaryHTML += '<p><strong>Namn:</strong> ' + employee.name + '<br>';
            summaryHTML += '<strong>Timmar arbetade:</strong> ' + employee.hoursWorked + '<br>';
            summaryHTML += '<strong>Beläggning:</strong> ' + employee.belaggning.toFixed(2) + '%</p><br>';

            totalHoursWorked += parseFloat(employee.hoursWorked);
            totalBelaggning += parseFloat(employee.belaggning);
        });

        // Hämta tillgängliga timmar enligt Excel-logiken
        let availableHours = getAvailableHoursForMonth(selectedMonth);
        let remainingHours = availableHours - totalHoursWorked;
        let avgBelaggning = employeeCount > 0 ? (totalBelaggning / employeeCount).toFixed(2) : 0;

        // Uppdatera total sammanställning
        var totalSummaryHTML = '<h3>Totalt</h3>';
        totalSummaryHTML += '<p><strong>Totalt arbetade timmar:</strong> ' + totalHoursWorked + '</p>';
        totalSummaryHTML += '<p><strong>Genomsnittlig beläggning:</strong> ' + avgBelaggning + '%</p>';
        totalSummaryHTML += '<p><strong>Tillgängliga timmar:</strong> ' + remainingHours + '</p>';

        $('#totalSummary').html(totalSummaryHTML).show();

    } else if (selectedInterval === 'week') {
        // Sammanställning för veckan
        var totalHoursInWeek = getTotalHoursForWeek(selectedMonth, selectedWeek);

        employeesData.forEach(function (employee) {
            var occupancyPercentage = (employee.hoursWorked / totalHoursInWeek) * 100;
            summaryHTML += '<p><strong>Namn:</strong> ' + employee.name + '<br>';
            summaryHTML += '<strong>Timmar arbetade:</strong> ' + employee.hoursWorked + '<br>';
            summaryHTML += '<strong>Beläggning:</strong> ' + occupancyPercentage.toFixed(2) + '%</p><br>';

            totalHoursWorked += parseFloat(employee.hoursWorked);
        });

        let availableHours = getAvailableHoursForWeek(selectedMonth, selectedWeek);
        let remainingHoursWeek = availableHours - totalHoursWorked;
        let avgBelaggningWeek = employeeCount > 0 ? (totalHoursWorked / availableHours * 100).toFixed(2) : 0;

        // Uppdatera total sammanställning för veckan
        var totalSummaryHTML = '<h3>Totalt</h3>';
        totalSummaryHTML += '<p><strong>Totalt arbetade timmar:</strong> ' + totalHoursWorked + '</p>';
        totalSummaryHTML += '<p><strong>Genomsnittlig beläggning:</strong> ' + avgBelaggningWeek + '%</p>';
        totalSummaryHTML += '<p><strong>Tillgängliga timmar:</strong> ' + remainingHoursWeek + '</p>';

        $('#totalSummary').html(totalSummaryHTML).show();
    }

    summaryHTML += '</ul>';
    $('#summary').html(summaryHTML);
    $('#downloadExcel').show();
});



$('#downloadExcel').click(async function () {
    var month = $('#month').val(); // Hämta den valda månaden
    var selectedInterval = $('#intervalDropdown').val(); // Hämta den valda tidsperioden (månad eller vecka)
    var fileName;

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

    // *** Dynamisk beräkning av tillgängliga timmar beroende på antalet anställda ***
    var availableHours;
    var currentEmployees = employees.length; // Räknar hur många anställda som är aktiva

    if (selectedInterval === "month") {
        availableHours = getAvailableHoursForMonth(month, currentEmployees); // Skicka antal anställda
        fileName = 'sammanställning - ' + month + '.xlsx';
    } else if (selectedInterval === "week") {
        var selectedWeek = $('#week').val(); // Hämta den valda veckan
        availableHours = getAvailableHoursForWeek(month, selectedWeek, currentEmployees); // Skicka antal anställda
        fileName = 'sammanställning - ' + month + ', vecka ' + selectedWeek + '.xlsx';
    }

    // Räkna ut kvarvarande timmar
    var remainingHours = availableHours - totalHoursWorked;
    if (remainingHours < 0) remainingHours = 0; // För säkerhet

    // Visa antalet tillgängliga timmar i Excel-filen för månaden eller den valda veckan
    sheet.cell(`A${totalRow + 1}`).value("Tillgängliga timmar").style({ bold: true });
    sheet.cell(`B${totalRow + 1}`).value(remainingHours).style({ bold: true });

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


    function calculateOccupancyForWeek(selectedMonth, selectedWeek) {
        var selectedMonthData = monthsWithWeeks.find(month => month.name === selectedMonth);
        var selectedWeekData = selectedMonthData.weeks.find(week => week.week === parseInt(selectedWeek));

        var workdaysInWeek = selectedWeekData.workdays;
        var totalHoursInWeek = workdaysInWeek * 8 * employees.length; // Antalet arbetsdagar * antal timmar per dag * antal anställda
        var hoursWorkedInWeek = parseInt($('#hoursWorked').val()); // Antalet timmar som faktiskt har arbetats under veckan

        // Hantera fallet när de totala arbetade timmarna är noll
        if (hoursWorkedInWeek === 0) {
            return 0; // Returnera 0 för beläggningen om inga timmar har arbetats
        }

        var occupancyPercentage = (hoursWorkedInWeek / totalHoursInWeek) * 100;
        return occupancyPercentage.toFixed(2); // Avrunda till två decimaler
    }

    // Funktion för att beräkna tillgängliga timmar för en månad
function getAvailableHoursForMonth(month) {
    var selectedMonthData = monthsWithWorkdays.find(m => m.name === month);
    if (!selectedMonthData) return 0; // Om månaden inte finns, returnera 0

    var totalHours = selectedMonthData.workdays * 8 * employees.length; // Korrekt beräkning

    return totalHours; // Returnera endast tillgängliga timmar
}

// Funktion för att beräkna tillgängliga timmar för en vecka
function getAvailableHoursForWeek(month, week) {
    var workdaysInWeek = getWorkdaysInWeek(month, week);
    if (workdaysInWeek === 0) return 0; // Om veckan inte finns, returnera 0

    var totalHours = workdaysInWeek * 8 * employees.length; // Korrekt beräkning

    return totalHours; // Returnera endast tillgängliga timmar
}


    // Funktion för att beräkna beläggning
    function calculateBelaggning(hoursWorked, totalHours) {
        // Implementera beräkningslogiken här
        return (hoursWorked / totalHours) * 100;
    }

   // En funktion för att hämta antalet arbetsdagar i en viss månad för 2025
function getDaysInMonth(month) {
    switch (month) {
        case "Januari":
            return 21;
        case "Februari":
            return 20;
        case "Mars":
            return 21;
        case "April":
            return 20;
        case "Maj":
            return 20;
        case "Juni":
            return 19;
        case "Juli":
            return 23;
        case "Augusti":
            return 21;
        case "September":
            return 22;
        case "Oktober":
            return 23;
        case "November":
            return 20;
        case "December":
            return 19;
        default:
            return 0; // Returnera 0 om månaden inte hittades
    }
}


    // En funktion för att beräkna totala arbetstimmar för en månad
    function getTotalHoursForMonth(month, daysInMonth) {
        return daysInMonth * 8; // Antag att en arbetsdag är 8 timmar
    }

    function getWorkdaysInWeek(month, week) {
        var selectedMonthData = monthsWithWeeks.find(m => m.name === month);
        if (selectedMonthData) {
            var selectedWeekData = selectedMonthData.weeks.find(w => w.week === parseInt(week));
            return selectedWeekData ? selectedWeekData.workdays : 0;
        }
        return 0; // Returnera 0 om månaden inte hittades
    }

    // En funktion för att beräkna totala arbetstimmar för en vecka
    function getTotalHoursForWeek(month, week) {
        var workdaysInWeek = getWorkdaysInWeek(month, week);
        return workdaysInWeek * 8; // Antalet arbetsdagar * antal timmar per dag
    }

    // Lyssna på klickhändelse för nollställningsknappen
    $('#reset').click(function () {
        // Återställ alla fält till deras standardvärden
        employeesData = [];
        $('#month').val('');
        $('#week').val('');
        $('#employeeFormGroup').hide();
        $('#hoursWorked').val('');
        $('#summary').empty();
        $('#totalSummary').empty().hide();
        $('#confirmationMessage').hide(); // Dölj bekräftelsemeddelandet
        $('#downloadExcel').hide();
        $('#monthFormGroup').hide(); // Dölj månadsdropdownen
        $('#weekFormGroup').hide(); // Dölj veckodropdownen
        $('#intervalDropdown').val(''); // Rensa tidsperiodsdropdownen
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
