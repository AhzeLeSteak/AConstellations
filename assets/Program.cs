#:package System.Drawing.Common@10.0.3
#:package System.Text.Json@10.0.3
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;

Console.WriteLine("Hello, World!");

var img = new System.Drawing.Bitmap("sky.png");

var coloredIndexes = Enumerable.Range(0, img.Width * img.Height).Where(index =>
{
    var x = index % img.Width;
    var y = index / img.Width;
    var pixel = img.GetPixel(x, y);
    return pixel.R + pixel.G + pixel.B > 0;
})
.ToHashSet();

void SaveResult(string fileName, ICollection<int> indexes)
{
    var result = new System.Drawing.Bitmap(img.Width, img.Height);
    indexes.ToList().ForEach(index =>
    {
        var x = index % img.Width;
        var y = index / img.Width;
        result.SetPixel(x, y, System.Drawing.Color.Red);
    });

    result.Save(fileName);
    Console.WriteLine($"Saved {fileName}");
}

//SaveResult("threshhold.png", coloredIndexes);


var firstStep = coloredIndexes.Where(index =>
{
    var x = index % img.Width;
    var y = index / img.Width;
    
    int neighbours = 0;
    for (int i = -1; i <= 1; i++)
    {
        for (int j = -1; j <= 1; j++)
        {
            if (i == 0 && j == 0) continue;
            var neighbourX = x + i;
            var neighbourY = y + j;
            if (neighbourX < 0 || neighbourX >= img.Width || neighbourY < 0 || neighbourY >= img.Height)
                continue;
            var neighbourIndex = neighbourY * img.Width + neighbourX;
            if (coloredIndexes.Contains(neighbourIndex))
                neighbours++;
        }
    }
    return neighbours == 8 
    || (neighbours == 4 
    && coloredIndexes.Contains(index + img.Width) 
    && coloredIndexes.Contains(index + 1)
    && coloredIndexes.Contains(index - img.Width) 
    && coloredIndexes.Contains(index - 1)
    );
})
.ToHashSet();

var centersIndexed = firstStep.Where(index =>
{
    var x = index % img.Width;
    var y = index / img.Width;
    
    int neighbours = 0;
    for (int i = -1; i <= 1; i++)
    {
        for (int j = -1; j <= 1; j++)
        {
            if (i == 0 && j == 0) continue;
            var neighbourX = x + i;
            var neighbourY = y + j;
            if (neighbourX < 0 || neighbourX >= img.Width || neighbourY < 0 || neighbourY >= img.Height)
                continue;
            var neighbourIndex = neighbourY * img.Width + neighbourX;
            if (firstStep.Contains(neighbourIndex))
                neighbours++;
        }
    }
    return neighbours == 0 || neighbours == 4;
})
.ToHashSet();

//SaveResult("centers.png", centersIndexed);

var json = JsonSerializer.Serialize(centersIndexed.Select(index =>
{
    var x = index % img.Width;
    var y = index / img.Width;
    var size = 4;
    while(!coloredIndexes.Contains(index + --size));
    return new Star(x, y, size);
}).ToList(), new JsonSerializerOptions
{
    TypeInfoResolver = new DefaultJsonTypeInfoResolver()
});

File.WriteAllText("centers.json", json);

record Star(int X, int Y, int Size);