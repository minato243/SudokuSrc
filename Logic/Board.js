var Board = cc.Class.extend({
    matrix:[],
    userMatrix:[],
	backupMatrix:[],
	tempMatrix:[],
    count:[],
    selected: null,
    error: null,
	numHint:3,
    numError:0,

    ctor: function(level){
		cc.log("New board level = "+level);
		this.matrix = [];
		this.userMatrix = [];
		this.backupMatrix = [];
		this.tempMatrix = [];
        for (var i = 0; i < SIZE; i++){
            this.matrix.push([]);
            this.userMatrix.push([]);
			this.backupMatrix.push([]);
			this.tempMatrix.push([]);
        }
		for (i = 0; i < SIZE; i++){
			for (var j = 0; j < SIZE; j++){
				this.tempMatrix[i].push([]);
			}
		}
        this.createMatrix(level);
        this.copyToUserMatrix();
        this.createCountMatrix();
		this.numHint = 3;
        this.numError = 0;
		this.selected = null;
    },

    createCountMatrix:function() {
		this.count =[];
		for (var i = 0; i < SIZE; i++) {
			for (var j = 0; j < SIZE; j++) {
				if (this.userMatrix[i][j] == 0)
					continue;
				this.count[this.userMatrix[i][j] - 1]++;
			}
		}
	},

	track:0,

	createMatrix: function(level) {
		for (var i = 0; i < SIZE; i++) {
			mark1: for (var j = 0; j < SIZE; j++) {
				var val = Math.floor(Math.random()*9 + 1);
				var counter = 0;
				while (this.isExist(i, j, val) && counter < SIZE) {
					val = (val) % SIZE + 1;
					counter++;

				}
				if (counter < SIZE) {
					this.matrix[i][j] = val;
				} else {
					if (this.track == i) {
						this.resetRow(i);
						this.resetRow(i - 1);
						this.track = -1;
						i -= 2;

						break;
					} else {
						this.resetRow(i);
						this.track = i;
						i--;
						break;
					}
				}
			}
		}
		this.backup();
		this.remove(level);
	},

	 backup: function() {
		for (var  i = 0; i < SIZE; i++) {
			for (var  j = 0; j < SIZE; j++) {
				this.backupMatrix[i][j] = this.matrix[i][j];
			}
		}
	},

	 copyToUserMatrix:function() {
		for (var i = 0; i < SIZE; i++) {
			for (var j = 0; j < SIZE; j++) this.userMatrix[i][j] = this.matrix[i][j];
		}
	},

	remove:function(level) {
		var temp = [ 20, 23, 25, 27, 30, 33, 35, 40, 45, 50, 55, 60, 65 ];
		temp =[1, 2,3,4,5,6,7,8,9,10,11,12];
		for (var i = 0; i < temp[level]; i++) {
			var row = Math.floor(Math.random() * SIZE);
			var col = Math.floor(Math.random() * SIZE);

			while (!this.isCellEmpty(row, col)) {
				if (!this.isRowEmpty(row))
					col = (col + 1) % 9;
				else if (!this.isColEmpty(col))
					row = (row + 1) % 9;
				else {
					col = (col + 1) % 9;
					row = (row + 1) % 9;
				}
			}

			this.matrix[row][col] = 0;
		}

	},

	isRowEmpty: function(row) {
		for (var j = 0; j < SIZE; j++) {
			if (this.matrix[row][j] != 0)
				return false;
		}
		return true;
	},

	isColEmpty:function(col) {
		for (var i = 0; i < SIZE; i++) {
			if (this.matrix[i][col] != 0)
				return false;
		}
		return true;
	},

	isCellEmpty:function(row, col) {
		return this.matrix[row][col] > 0;
	},

	resetRow:function(row) {
		for (var j = 0; j < SIZE; j++) {
			this.matrix[row][j] = 0;
		}
	},

	isExistInUserMatrix:function(row, col, val) {

		var ROW = Math.floor(row / 3);
		var COL = Math.floor(col / 3);

		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				if ((ROW * 3 + i == row) && (COL * 3 + j == col))
					continue;
				if (this.userMatrix[ROW * 3 + i][COL * 3 + j] == val)
					return new Point (ROW * 3 + i, COL * 3 + j);
			}
		}
		for (j = 0; j < SIZE; j++) {
			if (j == col)
				continue;
			if (this.userMatrix[row][j] == val)
				return new Point (row, j);
		}

		for (i = 0; i < SIZE; i++) {
			if (i == row)
				continue;
			if (this.userMatrix[i][col] == val)
				return new Point (i, col);
		}

		return null;
	},

	isExist: function( row, col, val) {
		for (var  j = 0; j < SIZE; j++) {
			if (j == col)
				continue;
			if (this.matrix[row][j] == val)
				return true;
		}

		for (var  i = 0; i < SIZE; i++) {
			if (i == row)
				continue;
			if (this.matrix[i][col] == val)
				return true;
		}

		var  ROW = Math.floor(row / 3);
		var  COL = Math.floor(col / 3);

		for (i = 0; i < 3; i++) {
			for (j = 0; j < 3; j++) {
				if ((ROW * 3 + i == row) && (COL * 3 + j == col))
					continue;
				if (this.matrix[ROW * 3 + i][COL * 3 + j] == val)
					return true;
			}
		}
		return false;
	},

	getUserMatrix: function() {
		return this.userMatrix;
	},

	setUserMatrix: function(userMatrix) {
		this.userMatrix = userMatrix;
	},

	getMatrix: function() {
		return this.matrix;
	},

	getSelect: function() {
		return this.selected;
	},

	setSelect: function(select) {
		if(this.selected == select) return;
		this.selected = select;
		this.error = null;
	},

	getError: function() {
		return this.error;
	},

	setError: function(error) {
		this.error = error;
	},

	getCountMatrix: function() {
		return this.count;
	},

	increaseCount: function(i) {
		if (this.count[i - 1] < 9)
			this.count[i - 1]++;
	},

    /*
    * insertIntoUserMatrix
    * @params row
    * @params col
    * @params val
    * return -1 if error
    * return 0 if it's true
    * return [1..9] if it was replace by val
    * */

	insertIntoUserMatrix: function(row, col, val) {
		cc.log("GameSudoku", "GameView insert to userMatrix ("+row+","+col+") = "+val);
		if (this.matrix[row][col] != 0)
			return -1;
		this.error = this.isExistInUserMatrix(row, col, val);
		if (this.error == null) {
			this.error = null;
			if (this.userMatrix[row][col] == val){
                this.numError ++;
                return -1;
            }

			if (this.userMatrix[row][col] != 0) {
				var  temp = this.userMatrix[row][col];
				this.userMatrix[row][col] = val;
				return temp;
			} else {
				this.userMatrix[row][col] = val;
				this.tempMatrix[row][col] = [];
			}
			return 0;
		} else {
            this.numError ++;
			return -1;
		}
	},

	insertIntoTempMatrix: function(row, col, val){
		if(this.userMatrix[row][col]!= undefined && this.userMatrix[row][col] != 0) return;
		if(this.tempMatrix[row][col] == undefined){
			this.tempMatrix[row][col] = [];
			this.tempMatrix[row][col].push(val);
		} else {
			var n = this.tempMatrix[row][col].length;
			var exist = false;
			for (var k = 0; k < n; k ++){
				if(this.tempMatrix[row][col][k] == val){
					exist = true;
					break;
				}
			}
			if(!exist) this.tempMatrix[row][col].push(val);
		}
	},

	removeMatrixAt: function(x, y) {
		var  temp = this.userMatrix[x][y];
		this.userMatrix[x][y] = 0;
		return temp;
	},

	isFull: function() {
		for (var  i = 0; i < SIZE; i++) {
			for (var  j = 0; j < SIZE; j++) {
				if (this.userMatrix[i][j] == 0)
					return false;
			}
		}

		return true;
	},

	hint: function(){
		if(this.selected == null) return;
		var i = this.selected.y;
		var j = this.selected.x;
		if(this.numHint > 0 && this.userMatrix[i][j] ==0){
			this.numHint --;
			this.userMatrix[i][j] = this.backupMatrix[i][j];
			this.tempMatrix[i][j] = [];
		}
	},

	eraser: function(){
		if(this.selected == null) return;
		var i = this.selected.y;
		var j = this.selected.x;

		this.userMatrix[i][j] = 0;
		this.tempMatrix[i][j] = [];
	},

	getMatrixString: function(){
		var result ="-1";
		for (var  i = 0; i < SIZE; i++){
			for (var  j =0; j< SIZE; j++){
				result+=","+this.matrix[i][j];
			}
		}
		return result;
	},

	getUserMatrixString: function(){
		var result ="-1";
		for (var  i = 0; i < SIZE; i++){
			for (var  j =0; j< SIZE; j++){
				result+=","+this.userMatrix[i][j];
			}
		}
		return result;
	}

});
