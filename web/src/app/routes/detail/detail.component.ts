import { Component, OnInit, Inject } from '@angular/core';
import { SFSchema, SFComponent } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceService } from '@shared/service.service';
import { MessageService } from '@shared/message.service';
import { format } from 'date-fns';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { of, from } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styles: []
})
export class DetailComponent implements OnInit {

  title: any = "Schedule";
  data: any = [];
  date: any;

  isVisible = false;
  formData: any;
  loading: boolean = false;
  schema: SFSchema = {
    properties: {
      title: {
        type: 'string', title: "title",
        ui: {
          placeholder: "title",
          errors: {
            'required': "title",
          },
        }
      },
      description: {
        type: 'string', title: "description",
        ui: {
          widget: 'textarea',
          autosize: { minRows: 4, maxRows: 8 },
          placeholder: "description",
          errors: {
            'required': "description",
          },
        }
      },
      startTime: {
        type: 'string',
        format: 'date',
      },
      endTime: {
        type: 'string',
        format: 'date',
      },
      place: {
        type: 'string', title: "place",
        ui: {
          placeholder: "place",
          errors: {
            'required': "place",
          },
        }
      },
      public: {
        type: 'string',
        title: "type",
        ui: {
          widget: 'radio',
          span: 16,
          asyncData: () => of([{ label: "public", value: true }, { label: "private", value: false }]).pipe(delay(100)),
        },
      },

    },
    required: ['title', 'description', 'startTime', 'endTime', 'place', 'public'],
    ui: {
      grid: { span: 24, },
    }
  };

  editId: any;
  name: any;
  constructor(
    private route: ActivatedRoute,
    public service: ServiceService,
    public message: MessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    this.route.params.subscribe((data) => {
      console.log(data)
      this.date = new Date(format(parseInt(data.date), 'YYYY-MM-DD' + " 00:00:00")).getTime();
      this.title = this.title + ' / ' + format(parseInt(data.date), 'YYYY-MM-DD')
    })
  }

  ngOnInit() {
    this.get();
  }

  search() {
    console.log(this.name)
    const tokenData = this.tokenService.get();
    console.log(tokenData.email)
    this.service.search({ keyword: this.name, email: tokenData.email })
      .then((res: any) => {
        console.log(res)
        console.log(res.data)
        var arr: any = [];
        res.data.forEach(element => {
          if (this.date == element.startTime || this.date == element.endTime || (this.date < element.endTime && this.date > element.startTime)) {
            arr.push(element)
          }
        });
        this.data = arr
      }).catch(() => { })
  }

  get() {
    console.log(format(parseInt(this.date), 'YYYY-MM-DD'))
    this.service.get({})
      .then((res: any) => {
        console.log(res)
        console.log(res.data)
        var arr: any = [];
        res.data.forEach(element => {
          if (this.date == element.startTime || this.date == element.endTime || (this.date < element.endTime && this.date > element.startTime)) {
            arr.push(element)
          }
        });
        console.log("123")
        console.log(arr)
        this.data = arr
      }).catch(() => { })
  }

  onChange(list) {
    // console.log(JSON.parse(list))
    if (JSON.parse(list).type == "show") {
      this.show(JSON.parse(list).id)
    }
    if (JSON.parse(list).type == "delete") {
      this.delete(JSON.parse(list).id)
    }
  }

  //新增日程
  show(id): void {
    this.editId = id;
    this.isVisible = true;
    this.data.forEach(element => {
      if (element.id == id) {
        this.formData = {
          title: element.title,
          description: element.description,
          startTime: element.startTime,
          endTime: element.endTime,
          place: element.place,
          public: element.public,
        }
      }
    });
  }

  delete(id): void {
    console.log(id)
    this.service.del({ id: id })
      .then((res: any) => {
        this.get();
        this.message.success("success datele Schedule")
      }).catch(() => { })
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  submit(value: any) {
    console.log(value)
    const tokenData = this.tokenService.get();
    console.log(tokenData.email)
    value.creatorEmail = tokenData.email;
    value.startTime = new Date(format(value.startTime, 'YYYY-MM-DD' + " 00:00:00")).getTime();
    value.endTime = new Date(format(value.endTime, 'YYYY-MM-DD' + " 00:00:00")).getTime();
    value.id = this.editId;
    this.service.update(value)
      .then((res: any) => {
        console.log(res)
        this.get();
        this.formData = {};
        this.isVisible = false;
        this.message.success("success add Schedule")
      }).catch(() => { })
  }



  //返回上一页
  back() {
    history.go(-1)
  }
}
