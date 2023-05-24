
myDir = uigetdir; %gets directory
myFiles = dir(fullfile(myDir,'*.csv')); %gets all csv files in struct
output = {zeros(50,2)};


for k = 1:length(myFiles)
    baseFileName = myFiles(k).name;
    fullFileName = fullfile(myDir, baseFileName);
    Array = csvread(fullFileName, 1, 0);
    col1 = Array(:, 1);
    col2 = Array(:, 2);
    plot(col1, col2)
    hold on
    risetime(col2,col1)

    output{k, 1} = baseFileName;
    output{k, 2} = risetime(col2,col1);
    disp(fullFileName)
end    
cell2csv(myDir+"risetimes.csv", output)