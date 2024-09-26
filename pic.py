from PIL import Image

im = Image.open('assets/images/swiss_map.png')
circle = Image.open('assets/images/circle.png')
im_w, im_h = im.size
circle_w, circle_h = circle.size

coord_x, coord_y = 20, 20
print(im.mode, circle.mode)
im.paste(circle, (coord_x + circle_w // 2, coord_y + circle_h // 2), circle)
im.save("new_pic.png")