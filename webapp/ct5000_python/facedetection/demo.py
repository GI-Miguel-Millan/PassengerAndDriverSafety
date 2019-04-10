import face

#If you want to run this, edit the group name below, and then uncomment all the print statements in face.py

demogroup = [group]

def demo():
    face.create_group(demogroup)

    face.add_student(demogroup, 'miguel', 'https://i.imgur.com/W4xDKtq.jpg')
    face.add_student(demogroup, 'bro2', 'https://i.imgur.com/DrYhBke.jpg')
    face.add_student(demogroup, 'bro1', 'https://i.imgur.com/4eryj8x.jpg')

    face.identify(demogroup, 'https://i.imgur.com/u1cDuVQ.jpg')

    face.identify(demogroup, 'https://i.imgur.com/ydgwud7.jpg')

    face.delete_student(demogroup, 'miguel')
    face.delete_student(demogroup, 'bro2')
    face.delete_student(demogroup, 'bro1')

    face.delete_group(demogroup)

if __name__ == "__main__":
    demo()