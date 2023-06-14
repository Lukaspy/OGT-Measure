//Pulse and Measure

if(!('Wavegen' in this) || !('Scope' in this)) throw "Please open a Scope and a Wavegen instrument";

//Set wavegen to generate 1 pulse 
Wavegen.Channel1.Mode.text = "Simple";
Wavegen.Synchronization.text = "Independent"
Wavegen.Channel1.Simple.Type.text = "Pulse";
Wavegen.Channel1.Simple.Frequency.value = 1000;
Wavegen.Channel1.Simple.Phase.value = 180;
Wavegen.Channel1.States.Auto.value = 1;
Wavegen.Channel1.States.Repeat.value = 1;
Wavegen.Channel1.Simple.Amplitude.value = 3.3;
Wavegen.Channel1.Simple.Period.text = "3ms"

Scope.Trigger.Trigger.text = "Repeated";
Scope.Trigger.Type.text = "Edge";
Scope.Trigger.Condition.text = "Either";
Scope.Trigger.Source.text = "Wavegen 1";

var save_user = Tool.question("Save?");
if (save_user) {
    var baseFile = Tool.getSaveFile("Filename/Directoty", "~/Documents/CampbellResearch")//Tool.getText("Filename/directory")
}
var repeat =  Tool.getText("Repeat times?")
var delay = Tool.getText("Delay? (s)")
print(baseFile)


//Pulse width in percentage
var t1_user = 10;
var t3_user = 5;
var t4_user = 1/10;

function pulseAndCapture(save) {
    Scope1.single();
    wait(.1);
    Wavegen.run();
    Scope1.wait();
    if (save) {
        Scope1.Export(baseFile+i.toString()+".csv", szView = "", fComments = false, fHeader = true, fLabel = true, fHeaderAsComment = false, szNotes = "")
    }
}

function generatePulse(t1,t3,t4) {
        generated = [];
        t1 *= 4096/100;
        t3 *= 4096/100;

        for (var i = 0; i < t1; i++){
            generated[Math.round(i)] = 1;
        }
        for (var t = t1; t < (t1+(t1*t4)); t++) {
            generated[Math.round(t)] = 0;
        }

        for (var i = (t1+(t1*t4)); i < (((t1+(t1*t4) + t3))); i++) {
            generated[Math.round(i)] = 1;
        }

        for (var i = (((t1+(t1*t4) + t3))); i <= 4096; i++) {
            generated[Math.round(i)] = 0;
        }
        return generated
        
        
}


if (Tool.question("Arb Pulses?")) {
    Wavegen.Channel1.Mode.text = "Custom";
    t4_factor = t4_user
    for (var i = 1; i <= repeat; i++) {
        print("dt = " + t4_factor);
        arbPulse = generatePulse(t1_user, t3_user, t4_factor);
        Wavegen.Custom.set("pulse" + i, arbPulse);
        Wavegen.Channel1.Mode.text = "Custom";
        Wavegen.Channel1.Custom.Type.text = "pulse" + i;
        Wavegen.Channel1.Custom.Amplitude.value = 3.3;
        Wavegen.Channel1.Custom.Frequency.value = 5;
        pulseAndCapture(save_user);
        wait(parseInt(delay));
        t4_factor *= 2;
    }

} else{
    for (var i = 1; i <= repeat; i++) {
        pulseAndCapture();
        wait(parseInt(delay));
    }
}



