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

Scope.Trigger.Trigger.text = "Repeated";
Scope.Trigger.Type.text = "Edge";
Scope.Trigger.Condition.text = "Either";
Scope.Trigger.Source.text = "Wavegen 1";

Scope.single();
wait(.1);
Wavegen.run();
Scope1.wait();


Scope1.Export("/home/lukas/Documents/CampbellResearch/"+Tool.getText("Filename/directory")+".csv", szView = "", fComments = false, fHeader = true, fLabel = true, fHeaderAsComment = false, szNotes = "")
