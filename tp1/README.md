# SGI 2023/2024 - TP1

## Group T05G05
| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Inês Cardoso         | 202005435 | up202005435@edu.fe.up.pt                |
| Joana Santos         | 202006279 | up202006279@edu.fe.up.pt                |

----
## Project information


- Use of various textures with different transformations throughout the whole scene.
- Implementation of different cameras:
    - Prepective cameras that allow to see closely diferent relevant objects (e.g: Robot, Carocha).
    - Orthographic cameras: Left, Right, Top, Front, Back.
- Additional section of the interface to make the axis visible or invisible.
- Additional section of the interface to control the texture of the floor.
- Additional section of the interface controls the diffuse and specular colors, as well as the shininess of the floor.
- Additional section of the interface is responsible for managing all the parameters of the spotlight positioned above the cake, such as: turn off, turn on, change its color.


### Scene 
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


### Items present in the scene 

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
 
## Issues/Problems

* Double-sided objects project shadows onto themselves, so to solve this problem, a bias was added to the lights that project shadows.
* No other issues or problems were found
