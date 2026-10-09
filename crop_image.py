from PIL import Image

try:
    img = Image.open('public/images/shah_times_article.jpg')
    # Let's crop the top part. The image is 1131x1600. 
    # Usually the article might be in the center or top. Let's crop a rectangle.
    # We can try to crop the top 50% for now and see if it looks right.
    # Actually, the user attached a landscape-oriented crop. Let's crop it to 1131 x 600 from the top or middle.
    
    # I'll create 3 different crops and we can see which one matches.
    crop1 = img.crop((0, 0, 1131, 800))
    crop1.save('public/images/crop1.jpg')
    
    crop2 = img.crop((0, 200, 1131, 1000))
    crop2.save('public/images/crop2.jpg')
    
    print("Cropped images created.")
except Exception as e:
    print(f"Error: {e}")
