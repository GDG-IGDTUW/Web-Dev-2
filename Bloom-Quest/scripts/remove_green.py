from PIL import Image
import os
import math

# Files to process: Input -> Output
files_map = {
    'public/items/decor_cat_green.png': 'public/items/decor_cat.png',
    'public/items/decor_firepit_green.png': 'public/items/decor_firepit.png',
    'public/items/decor_gnome_green.png': 'public/items/decor_gnome.png',
    'public/items/decor_mushrooms_green.png': 'public/items/decor_mushrooms.png'
}

def distance(c1, c2):
    (r1, g1, b1) = c1
    (r2, g2, b2) = c2
    return math.sqrt((r1 - r2)**2 + (g1 - g2)**2 + (b1 - b2)**2)

def remove_green_bg(input_path, output_path):
    print(f"Processing {input_path} -> {output_path}...")
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        
        new_data = []
        for item in datas:
            # Check distance from pure green
            p = item[:3]
            # r < 100, g > 200, b < 100 is a safe bet for "bright green".
            if p[1] > 200 and p[0] < 100 and p[2] < 100:
                 new_data.append((255, 255, 255, 0)) # Transparent
            else:
                new_data.append(item)

        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"  Saved {output_path}")
    except Exception as e:
        print(f"  Error processing {input_path}: {e}")

for input_f, output_f in files_map.items():
    if os.path.exists(input_f):
        remove_green_bg(input_f, output_f)
    else:
        print(f"File not found: {input_f}")
