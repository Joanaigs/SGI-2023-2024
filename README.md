# SGI 2023/2024

## Group T05G05
| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Inês Cardoso         | 202005435 | up202005435@edu.fe.up.pt                |
| Joana Santos         | 202006279 | up202006279@edu.fe.up.pt                |

----

## Projects

### [TP1 - ThreeJS Basics](tp1)

#### Project Information

- Use of various textures with different transformations throughout the whole scene.
- Implementation of different cameras:
    - Prepective cameras that allow to see closely diferent relevant objects (e.g: Robot, Carocha).
    - Orthographic cameras: Left, Right, Top, Front, Back.
- Additional section of the interface to make the axis visible or invisible.
- Additional section of the interface to control the texture of the floor.
- Additional section of the interface controls the diffuse and specular colors, as well as the shininess of the floor.
- Additional section of the interface is responsible for managing all the parameters of the spotlight positioned above the cake, such as: turn off, turn on, change its color.


#### Scene 
Our scene represents the living room of a lonely robot on its birthday.

`Figure 1 `
![](https://git.fe.up.pt/sgi-meic/sgi-2023-2024/t05/sgi-t05-g05/raw/main/tp1/Screenshots/overall.png?ref_type=heads)

`Figure 2`
![](https://git.fe.up.pt/sgi-meic/sgi-2023-2024/t05/sgi-t05-g05/raw/main/tp1/Screenshots/robot.png)


In figure 3 it's possible to see:
* **Coffe Table:** On the coffee table there is a **three-layered cake** with a lit **candle** emitting a soft light, and a **stack of plates**.
* **Television** currently turned off.
* **Comfy Seating:** A sofa and an armchair adorned with differently sized pillows. On the armchair, there is also a newspaper.
* **Cabinets**: There are three cabinets: Two **bookshelves** filled with **books** on the front and right wall, and a **sturdy cabinet** placed on the floor, bellow the television. The colors of the **books** are random: they change every time the page is refreshed.
* **Artsy Vase**: A **vase made of cylinders** holding a bunch of paper flowers. The colors of the flowers are chosen randomly, so they change every time the page refreshes.
* **Robot**: There is also a robot seated on the sofa, holding a plate with a piece of **cake**.

`Figure 3`
![](https://git.fe.up.pt/sgi-meic/sgi-2023-2024/t05/sgi-t05-g05/raw/main/tp1/Screenshots/tv_side.png)


In figure 4 it's possible to see:
* **Dining table with chairs** where it is placed a **metal coil** and a **glass vase** holding a beautiful **sunflower**.
* **Picture frames** with Monet paintings on the wall.
* **Car neon sign** made of curves.
* **Large windows** featuring curtain rods and curtains made from curved surfaces.

`Figure 4`
![](https://git.fe.up.pt/sgi-meic/sgi-2023-2024/t05/sgi-t05-g05/raw/main/tp1/Screenshots/dinning_table.png?ref_type=heads)

`Figure 5`
![](https://git.fe.up.pt/sgi-meic/sgi-2023-2024/t05/sgi-t05-g05/raw/main/tp1/Screenshots/curved_flower.png?ref_type=heads)


#### Items present in the scene 

| Object | Type|
| -------- | -------- | 
| Robot     | Solids     |
| Vase with flowers  | Solids    |
| Sofas, Tables and Chairs | Solids     | 
| Cabinets (Two bookshelves, and a television cabinet on the ground)  | Solids   | 
| Cake, Piece of Cake, Plates and Candle | Solids   | 
| Books, Frames and Carpet  | Solids     | 
| Lampshades | Solids     | 
| Flower    | Solids & Curves | 
| Carocha   | Curves  |
| Coil   | Curves  | 
| Round Vase   | Surfaces    |
| Curtains   | Surfaces  | 
| Jornal   | Surfaces  | 
| Pillows  | Surfaces  |
| Two Spot Lights with shadows | Lights |
| One Ponit Light | Lights |
| Ambient Light | Lights |
 

### [TP2 - Development of a 3D graphics application](tp2)

#### Project information


In this project, a scene was generated by parsing an XML file and incorporating code to facilitate its interpretation. Various advanced textures were employed, including **skybox**, **mip-maps**, **bump textures**, **video textures**, and **specular maps**.
Objects were also created using both objects belonging to THREE.JS classes and **buffer geometry**. It's crucial to highlight in this scene the varying level of detail in materials based on distance, achieved through the **use of LODs** (Level of Detail).
Finally, it's worth noting the **creativity** of the scene and the imaginative manner in which objects were created. Additionally, the level of **control and interactivity** within the scene is noteworthy.


#### Strong Points
* **Creative** application of the discussed techniques to produce the scene. For example:
    * Use of both polygons and lods to create a paiting of a sunflower (made with polygons) that rotates when the distance to it changes (made with LoDs).
    * Use of nurb curves to make Christmas Socks and Candy Canes.
* **High level of control and interactivity** with the scene.
* **High detail** on the objects created.


#### Scene Information

##### Description
The created scene consists of an interior part, featuring a festively decorated living room for the Christmas season, and an exterior part that showcases the outside of the house where the living room is contained, surrounded by trees, fences, and a snowman nearby the entrance.


##### Techniques used:

##### 1. Construction of objects

| Objects | Techniques |
| -------- | -------- | 
| Candycanes on the Coffe Table, Socks hanging on the chinmey, Curtains, Cloth on the dinner table, Vase, Pillows  | Nurbs     | 
| Table, Chair, Chimney, Santa Claus' Legs, Cabinet, Bookshelf, Sofas, Lampshades, Plates, Food (cookies and cup of milk), candles, Paiting Frames, Walls, Roof, Floor, Doors | Three.JS Objects    | 
| Windows on the outside of the house, Paiting representing a sunflower, Carpet, Chritmas Tree Star in the second level of detail   | Buffer Geometry (Polygons)    | 

##### 2. Texture techniques employed

| Object | Texture Technique |
| -------- | -------- | 
| Outside Landscape   | SkyBox    | 
| Paitings on the Dinning Side of the living room  | Mip-Maps
| Material on the chinmey, Material on the outside foundation of the house, the wood material of trunks of the trees and the fences and the roof | Bump-Texture   | 
| Video on the television | Video Texture   | 
| House Roof | Specular-Map   | 


##### 3. LoDs

Many materials have different levels of detail.

* The christmas tree has 3 levels of detail:
    * The first level is composed by 3 cylinders with all the decorations and gifts at the bottom. 
    * The second is composed by 2 cylinders, whithout decorations except for the star at the top that turns into a polygon and the gifts at the bottom.
    * The thrid level is composed by only 1 cylinder with no decorations and no gifts at the bottom.
* The outside trees have 3 levels of detail: The first level is composed by 3 cylinders, the second is composed by 2 cylinders and the third level is composed by only 1 cylinder.
* The bookshelf has 2 levels of detail: One where it's possible to see all the selves and other where the shelves part is changed by a compact box.
* The vase has 2 levels of details: One where its possible to see its curves, and other where this curves turn into cylinders, giving the vase a more straight appearance.
* The snowman has also 3 levels:
    * One where it's possible to see the 3 balls that make its body, eyes, arms, buttons and hat.
    * Second one where it's only possible to see the 3 balls that make its body and the hat.
    * Third one where it's only possible to see the ball corresponding to the head of the snowman with the hat,and a oblate sphere corresponding to the rest of the body.
* The house outside is composed by different materials, but that combined give four levels of detail:
    * On the first level, the front of the house features a porch with a door and a handrail. Additionally, there are three windows: one on the roof, one on the left, and another on the right.
    * Moving to the second level, the porch undergoes a transformation, being replaced by a box. Simultaneously, the octagonal window on the roof is replaced by a circular one. At this level of detail, the window frames are not visible, allowing only the glass to be seen, and the berm of the chinmey also disappears.
    * On the third level of detail, all the windows and the chinmey disappear
* The fence outside has 2 levels of detail:
    * One where it's possible to see large trunks connected by smaller horizontal trunks.
    * Second one where it's only possible to see the larger trunks.


#### Interactions available

* Make the axis visible or not visible
* Turn On/Off each existent light.
* Change the camera, allowing to focus on different objects of the scene.
* Switch between Wireframe visualization or normal visualization.
* Change the magFilter and minFilter of the textures.
* Make the Santa Claus in the chinmey go Up or Down.
* Change the texture of the the socks hanging on the chimney.
* Change the light mode of the chritmas tree (On, Off and Blinking).
* Change the color of the tree decorations (It's possible to either choose the color manually or toggle a button to randomly assign a color to each ball).
* Alter the quantity of cookies displayed on the plate placed on the coffee table.
* Adjust the amount of milk in the cup placed on the coffee table.
* Turn ON/OFF the candles on the dinning table.
* Turn ON/OFF the video and sound on the television.

##### Scene Screenshots


`Figure 1 `
![](https://git.fe.up.pt/sgi-meic/sgi-2023-2024/t05/sgi-t05-g05/raw/main/tp2/screenshots/television_side.png)

`Figure 2 `
![](https://git.fe.up.pt/sgi-meic/sgi-2023-2024/t05/sgi-t05-g05/raw/main/tp2/screenshots/dining_side.png)

`Figure 3 `
![](https://git.fe.up.pt/sgi-meic/sgi-2023-2024/t05/sgi-t05-g05/raw/main/tp2/screenshots/house_outside.png)

#### Issues/Problems
No issues found.

___

### [TP3 - Development of a game](tp3)
#### Project information


In this project, a small 3D game car game was made. In it we utilized the xml and its parser to load some background objects.  Various advanced textures were employed, including skybox, bump textures, and specular maps.
Objects were also created using both objects belonging to THREE.JS classes, buffer geometry and nurbs. Various shaders were also used to enhace the scene overall.  LODs (Level of Detail) were also used, as well as shadows.
New techines learned were also utilized like Picking, Keyframe animations,Spritesheets and Particle systems. 



#### Strong Points
* All the necessary elements and techniques for completing this project have been implemented.
* Creativity in the employed techniques and innovation is evident throughout the project. For instance:
    * We changed the parser so it allows the existence of shader materials.
    * We have creative power-ups: like one that opens a short-cut on the track, or other that makes the car slippery while it rains on the background.
    

#### Scene Information

##### Description
The created scene consists of a candy land where cars from two different candy shops race againts each other. It is consisted by three states:  menu, game play and gameover.


##### Techniques used:

###### 1. Object selection / Picking

* Buttons accross the menu and game use picking to move to the next stage. All this buttons also have hover detection, where they change color when the mouse is on top of them.It is also used to pick the cars of the game.
* When manipulating obstacles on the track—whether repositioning or adding new ones—a click of the mouse initiates process. The selected object follows the mouse cursor until it finds a new position. Additionally, these objects respond to the hover effect, providing visual cues during the placement process. 

###### 2.  Keyframe animation

| Animation | 
| -------- | 
| Car Position   | 
| Car Rotation  |
|  Front wheels rotation side to side
| Front wheels rotation  on its axis | 
| Back wheels rotation  on its axis |


###### 3. Collision detection
Off-track detection was implemented through raycasting, while collision detection between the vehicle and other objects utilized Bounding Boxes. This choice was made considering that the majority of our objects were rectangular, making Bounding Boxes a suitable option for collision detection.
We tried to implement the Render to Texture technique for the off track detection. However, our implementation proved to be less precise than the raycasting method. Therefore, since the raycasting demonstrated comparable performance, we ultimately opted for raycasting.


###### 4. Spritesheets

SpriteSheets were used across the game to display the text.

###### 5. Shaders

* The obstacles and the power-ups have a shader that pulsates, and change color(light to dark) to give an aspect of a blinking object
* The floor of our track scene has shaders to create volume and displace according to a height map.
* Lolipops use shader to create a slight displacement to give the aspect of a spiral. To do this shaders were added to the parser of the xml.
* An outdoors that every minute gets a RGB image and a LGray from the scene and creates a 3d plane of whats on the camera

###### 6. Particles system

* Fireworks
* Rain


##### 2D Interactions available

* Make the axis visible or not visible
* Change the camera, allowing to focus on different objects of the scene.
* Switch between seeing boundig boxes around the objects or not
* Show the checkpoints in the track or not
* Show the route of the animated car

##### Scene Screenshots


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

#### Issues/Problems
No issues found.





