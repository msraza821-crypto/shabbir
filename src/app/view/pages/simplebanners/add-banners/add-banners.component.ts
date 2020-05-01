import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,FormArray,FormBuilder,Validators} from  "@angular/forms";
import { ERROR_MESSAGES, CONFIG, Regex } from 'src/app/constants';
import { CommonUtil } from 'src/app/util';
import { HttpService, AppService } from 'src/app/service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-add-banners',
  templateUrl: './add-banners.component.html',
  styleUrls: ['./add-banners.component.scss']
})
export class AddBannersComponent implements OnInit {

  closeResult = '';
  bannerForm:FormGroup;
selectedValue=[];
CONFIG = CONFIG;
isProduct=false;
isBrand=false;
showPage=false;
  brands=[];
  inlineCheckbox='checkbox'
  loader = false;
  discountType=""
  page: number = 1;
  limit=10;
  totalRec=50;


  url1 = ''; url: string = '';
  message: string = '';
  keyValue: boolean = false;

  constructor(private fb:FormBuilder,
    private _util: CommonUtil,
    private api:HttpService,
    private spinner:NgxSpinnerService,
    private route:ActivatedRoute,
    private router:Router,
    private _api:AppService
    
    ) {
   this.spinner.show();
    this.api.getReqAuthBrands("admin/product/brand-list").pipe().subscribe(res=>{
      if(res)
      {this.spinner.hide()
        this.brands=res.result;
        this.showPage=true;
        console.log(this.brands)
      this.createForm()
      this.getCategory()
      
    
      }
    
      
    });
console.log(ERROR_MESSAGES.SUBCATEGORY_REQUIRED)

  }
  createForm()
  {
    this.bannerForm=this.fb.group({
      title:['',[Validators.required,Validators.maxLength(CONFIG.NAME_MAX_LENGTH),Validators.minLength(CONFIG.NAME_MINLENGTH)]],
      // minimum_value:['',[Validators.required,Validators.pattern(Regex.pricePattern)]],
      // available_on:['',[Validators.required]],
      // discount_type:['',[Validators.required]],
      // discount_value:['',[Validators.required,Validators.pattern(Regex.pricePattern)]],
      category:['',[Validators.required]],
      sub_category:['',[Validators.required]],
      // child_category:['',[Validators.required]],
       status:['',[Validators.required]],
      display_order:['',[Validators.required]]
    
    });
  }

  imageFormats: Array<string> = ['jpeg','png','jpg'];

  FORM_ERROR = {
    title: {
      required: ERROR_MESSAGES.BANNER_TITLE_REQUIRED,
      maxlength: `${ERROR_MESSAGES.MAX_LENGTH}${this.CONFIG.NAME_MAX_LENGTH}`,
      pattern: ERROR_MESSAGES.INVALID_INPUT,
      minlength: `${ERROR_MESSAGES.MIN_LENGTH}${this.CONFIG.NAME_MINLENGTH}`,
    },
    status: {
      required: ERROR_MESSAGES.STATUS_REQUIRED,
      
     
    },
    category: {
      required: ERROR_MESSAGES.CATEGORY_REQUIRED,
   
    },
    sub_category: {
      required: ERROR_MESSAGES.SUBCATEGORY_REQUIRED
    },
    display_order: {
      required: ERROR_MESSAGES. DISPLAY_ORDER_REQUIRED
    }
 };

id;

selectedProduct=[]

onFilterChange(eve: any,id) {
this.productCompare(id)
}

productCompare(id:any)
{
  
  for(let i=0;i<this.selectedProduct.length;i++)
  {
    if(id==this.selectedProduct[i])
    {
      const index = this.selectedProduct.indexOf(this.selectedProduct[i], 0);
      if (index > -1) {
        this.selectedProduct.splice(index, 1);
        return;
              }

    }
  }

      this.selectedProduct.push(id)
      console.log(this.selectedProduct)
    

  }

ngOnInit()
{
  this.route.params.subscribe(param=>
    {
      if(param && param['id'])
      {

this.id=param.id
console.log(this.id)
this.viewBanner()
      }
    })
   
}

  checked = "";
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;


  get title(): FormControl {
    return this.bannerForm.get("title") as FormControl;
   }
  // get minimum_value(): FormControl {
  //   return this.bannerForm.get("minimum_value") as FormControl;
  // }
  // get available_on(): FormControl {
  //   return this.bannerForm.get("available_on") as FormControl;
  // }
  // get discount_type(): FormControl {
  //   return this.bannerForm.get("discount_type") as FormControl;
  // }
  // get discount_value(): FormControl {
  //   return this.bannerForm.get("discount_value") as FormControl;
  // }
  get category(): FormControl {
    return this.bannerForm.get("category") as FormControl;
  }
  get sub_category(): FormControl {
    return this.bannerForm.get("sub_category") as FormControl;
  }
  get child_category(): FormControl {
    return this.bannerForm.get("child_category") as FormControl;
  }
  get status(): FormControl {
    return this.bannerForm.get("status") as FormControl;
  }
  get brandArray()
  {
    return (this.bannerForm.get("brand")as FormArray).controls;
  }
  get  display_order ():FormControl
  {
    return this.bannerForm.get("display_order") as FormControl 
  }


  getSelectedValue()
  {
    this.selectedValue=[];
    this.brandArray.forEach((control,i)=>{
      if(control.value)
      {
        this.selectedValue.push(this.brands[i]);
      }
    });
    
  }
  categoryList;
  getCategory(){
    this.api
    .getReqAuth("admin/banner/category-list?parent_id=0")
    .subscribe(
      res =>{
        console.log('categort',res)
  this.categoryList=res.result
  console.log('categorlist',this.categoryList)
      },
      err => this.error(err),
      () => (this.loader = false)
    );
    }
  subCategoryList;
 getSubcategory(){
   
    this.api.getReqAuth("admin/banner/category-list?parent_id="+this.bannerForm.value.category)
    
    .subscribe(
      res => {
        this.subCategoryList=res.result
        console.log(this.subCategoryList)
      },
      err => this.error(err),
      () => (this.loader = false)
    );
  }
  onSubmit()
  {

    // var start1 = '';
    // var end1 = '';
  
    //  if(this.bannerForm.value.date){
    //    start1=this.bannerForm.value.date.startDate._d;
    //    var startDate=new Date(start1)
    //     start1 =startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate();
    //    end1=this.bannerForm.value.date.endDate._d;
    //    var endDate=new Date(end1)
    //    end1 =endDate.getFullYear()+"-"+(endDate.getMonth()+1)+"-"+endDate.getDate();
    //  }
    // console.log(start1)
    // console.log(end1)
    if(this.bannerForm.valid)
    {

      this.spinner.show();
      const formData = new FormData();
    formData.append('title', this.bannerForm.value.title);
    formData.append('banner_type','1');
   formData.append('display_order',this.bannerForm.value.display_order)
   formData.append('image', this.url1);
  //   formData.append('available_on', this.bannerForm.value.available_on);
  //   formData.append('discount_type', this.bannerForm.value.discount_type);
  //   formData.append('discount_value', this.bannerForm.value.discount_type);
  //   formData.append('minimum_value', this.bannerForm.value.minimum_value);
    formData.append('category', this.bannerForm.value.category);
    formData.append('sub_category', this.bannerForm.value.sub_category);
 formData.append('status',this.bannerForm.value.status );
    
  
    // console.log('sss',formData)
     this.api.postReqAuth("admin/banner/add-banner",formData).subscribe(
      res => this.success(res),
      err => this.error(err),
      () => (this.loader = false)


    );
    
    }
    else
    this._util.markError(this.bannerForm);

    }

 
    
  keyPress(event: any) {
    const pattern = /[0-9.]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {    
      
        event.preventDefault();
    }
}
productList=[];

getProductList()
{
  var url="admin/product/list"
  this.api
    .getReqAuth(url)
    .subscribe(
      res =>{
        console.log(res)
        this.productList=res.result.data;
        console.log('product',this.productList)
      },

      err => this.error(err),
      () => (this.loader = false)
    );

}

namePress(event: any) {
  const pattern = /[0-9]/;
  const inputChar = String.fromCharCode(event.charCode);

  if (pattern.test(inputChar)) {    
    
      event.preventDefault();
  }
}

changeDiscountType(){
console.log('from discount change')
  if(this.bannerForm.value.discount_type=='1')
  this.discountType="Enter discount value..."
  else
  this.discountType="% of Off...."
}


counter(i: number) {
  return new Array(i);
}
choosefile: string = "No file chosen...";
onSelectFile(event) {
  this.keyValue = true;
  if (event.target.files && event.target.files[0]) {
    var mimeType = event.target.files[0].type;
    var file = event.target.files[0];
    this.choosefile=event.target.files[0].name;

    const width = file.naturalWidth;
    const height = file.naturalHeight;

    window.URL.revokeObjectURL(file.src);
    //  var checkimg = file.toLowerCase();
    const type = file.type.split('/');
    if (type[0] === 'image' && this.imageFormats.includes(type[1].toLowerCase())) {

    } else {
      this.errorMessage = "Please use proper format of image like jpeg,jpg and png only.";
      return false;
    }


    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); // read file as data url
    reader.onload = (event: any) => { // called once readAsDataURL is completed
     // this.url = event.result;
      this.url = event.target.result;
    }


    this.url1 = event.target.files[0];
    console.log(this.url1)


    setTimeout(() => {
      this.loader = false;
      this.keyValue = false;
      this.errorMessage = "";
    }, 3000)
    this.loader = true;

  }
}
errorMessage

viewBanner(){
  this.spinner.show();
  this.api
  .getReqAuth("admin/banner/banner-detail?id="+this.id)
  .subscribe(
    res => this.successView(res),
    err => this.error(err),
    () => (this.loader = false)
  );
}
productCate(){
  this.api
  .getReqAuth("admin/banner/category-list?parent_id=0")
  .subscribe(
    res =>{
      console.log('categort',res)
this.categoryList=res.result
console.log('categorlist',this.categoryList)
    },
    err => this.error(err),
    () => (this.loader = false)
  );
  }

  productSubCate(id){
 
  this.api.getReqAuth("admin/banner/category-list?parent_id="+id)
  
  .subscribe(
    res => {
      this.subCategoryList=res.result
      console.log(this.subCategoryList)
    },
    err => this.error(err),
    () => (this.loader = false)
  );
}
successView(res){
  if(res.status==true){
  var data= res.result;
  this.productCate();
  this.productSubCate(data['category']);

  Object.keys(this.bannerForm.controls).forEach((control) => {

    this.bannerForm.get(control).patchValue(data[control]);

  });

this.url=data['image'];
var str = this.url.split('/');
this.choosefile = str[str.length - 1];
  }
}


update(){
  if(this.bannerForm.valid)
  {

    this.spinner.show();
    const formData = new FormData();
formData.append('title', this.bannerForm.value.title);
formData.append('id',this.id);
formData.append('banner_type','1');
formData.append('display_order',this.bannerForm.value.display_order)
formData.append('image', this.url1);
formData.append('category', this.bannerForm.value.category);
formData.append('sub_category', this.bannerForm.value.sub_category);
formData.append('status',this.bannerForm.value.status );
this.api.putReqAuth("admin/banner/edit-banner",formData).subscribe(
  res => this.success(res),
  err => this.error(err),
  () => (this.loader = false)


);

}
else
this._util.markError(this.bannerForm);

}

success(res) {
  setTimeout(() => {     
    this.spinner.hide();
  }, 1000);
  if (res.status == true) {
     this._api.showNotification( 'success', res.message );     
      this.router.navigate(['theme/simplebanners'])
  } else {
    this._util.markError(this.bannerForm);
    this._api.showNotification( 'error', res.message );
  }

}
error(res) {
  setTimeout(() => {     
    this.spinner.hide();
  }, 1000);
  this._api.showNotification( 'error', res.message );
  
}
}