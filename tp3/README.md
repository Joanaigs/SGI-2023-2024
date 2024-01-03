# SGI 2023/2024 - TP2

## Group T05G05
| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Inês Cardoso         | 202005435 | up202005435@edu.fe.up.pt                |
| Joana Santos         | 202006279 | up202006279@edu.fe.up.pt                |


## Project information


In this project, a small 3D game car game was made. In it we utilized the xml and its parser to load some background objects.  Various advanced textures were employed, including skybox, bump textures, and specular maps.
Objects were also created using both objects belonging to THREE.JS classes, buffer geometry and nurbs. Various shaders were also used to enhace the scene overall.  LODs (Level of Detail) were also used, as well as shadows.
New techines learned were also utilized like Picking, Keyframe animations,Spritesheets and Particle systems. 



## Strong Points
* All the necessary elements and techniques for completing this project have been implemented.
* Creativity in the employed techniques and innovation is evident throughout the project. For instance:
    * We changed the parser so it allows the existence of shader materials.
    * We have creative power-ups: like one that opens a short-cut on the track, or other that makes the car slippery while it rains on the background.
    

## Scene Information

### Description
The created scene consists of a candy land where cars from two different candy shops race againts each other. It is consisted by three states:  menu, game play and gameover.


### Techniques used:

#### 1. Object selection / Picking

* Buttons accross the menu and game use picking to move to the next stage. All this buttons also have hover detection, where they change color when the mouse is on top of them.It is also used to pick the cars of the game.
* When manipulating obstacles on the track—whether repositioning or adding new ones—a click of the mouse initiates process. The selected object follows the mouse cursor until it finds a new position. Additionally, these objects respond to the hover effect, providing visual cues during the placement process. 

#### 2.  Keyframe animation

| Animation | 
| -------- | 
| Car Position   | 
| Car Rotation  |
|  Front wheels rotation side to side
| Front wheels rotation  on its axis | 
| Back wheels rotation  on its axis |


#### 3. Collision detection
Off-track detection was implemented through raycasting, while collision detection between the vehicle and other objects utilized Bounding Boxes. This choice was made considering that the majority of our objects were rectangular, making Bounding Boxes a suitable option for collision detection.
We tried to implement the Render to Texture technique for the off track detection. However, our implementation proved to be less precise than the raycasting method. Therefore, since the raycasting demonstrated comparable performance, we ultimately opted for raycasting.


#### 4. Spritesheets

SpriteSheets were used across the game to display the text.

#### 5. Shaders

* The obstacles and the power-ups have a shader that pulsates, and change color(light to dark) to give an aspect of a blinking object
* The floor of our track scene has shaders to create volume and displace according to a height map.
* Lolipops use shader to create a slight displacement to give the aspect of a spiral. To do this shaders were added to the parser of the xml.
* An outdoors that every minute gets a RGB image and a LGray from the scene and creates a 3d plane of whats on the camera

#### 6. Particles system

* Fireworks
* Rain


### 2D Interactions available

* Make the axis visible or not visible
* Change the camera, allowing to focus on different objects of the scene.
* Switch between seeing boundig boxes around the objects or not
* Show the checkpoints in the track or not
* Show the route of the animated car

### Scene Screenshots


`Figure 1 `
![](https://git.fe.up.pt/sgi-meic/sgi-2023-2024/t05/sgi-t05-g05/raw/main/tp3/screenshots/main_page.png)

`Figure 2 `
![](https://git.fe.up.pt/sgi-meic/sgi-2023-2024/t05/sgi-t05-g05/raw/main/tp3/screenshots/pick_car.png)

`Figure 2`
![](https://git.fe.up.pt/sgi-meic/sgi-2023-2024/t05/sgi-t05-g05/raw/main/tp3/screenshots/camera.png)

`Figure 4`
![](https://git.fe.up.pt/sgi-meic/sgi-2023-2024/t05/sgi-t05-g05/raw/main/tp3/screenshots/scene.png)

`Figure 5`
![](https://git.fe.up.pt/sgi-meic/sgi-2023-2024/t05/sgi-t05-g05/raw/main/tp3/screenshots/outdoorDisplay.png)

`Figure 6`
![](https://git.fe.up.pt/sgi-meic/sgi-2023-2024/t05/sgi-t05-g05/raw/main/tp3/screenshots/outdoor.png)


`Figure 7 `
![](https://git.fe.up.pt/sgi-meic/sgi-2023-2024/t05/sgi-t05-g05/raw/main/tp3/screenshots/final.png)

## Issues/Problems
No issues found.



