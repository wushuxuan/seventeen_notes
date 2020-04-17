import { Component, OnInit, Inject } from '@angular/core';
import { SFSchema, SFComponent } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { Router } from '@angular/router';
import { ServiceService } from '@shared/service.service';
import { MessageService } from '@shared/message.service';
import { format } from 'date-fns';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { of, from } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
    `
      .events {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .events .ant-badge-status {
        overflow: hidden;
        white-space: nowrap;
        width: 100%;
        text-overflow: ellipsis;
        font-size: 12px;
      }

      .notes-month {
        text-align: center;
        font-size: 28px;
      }

      .notes-month section {
        font-size: 28px;
      }
    `
  ]
})
export class DashboardComponent implements OnInit {

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

  data: any = [];
  name: any;
  constructor(private http: _HttpClient, private router: Router, public message: MessageService, public service: ServiceService, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, ) { }

  ngOnInit() {
    this.get()
  }


  search() {
    console.log(this.name)
    const tokenData = this.tokenService.get();
    console.log(tokenData.email)
    this.service.search({ keyword: this.name, email: tokenData.email })
      .then((res: any) => {
        console.log(res)
        console.log(res.data)
        this.data = res.data
      }).catch(() => { })
  }

  get() {
    this.service.get({})
      .then((res: any) => {
        console.log(res)
        this.data = res.data
      }).catch(() => { })
  }
  getMonthData(date: Date): number | null {
    return null;
  }

  //面板更新
  panelChange(target) {
    console.log("面板更新:")
    console.log(target)
  }

  //日期更新
  selectChange(target) {
    console.log("日期更新:")
    console.log(target)
  }

  //新增日程
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
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
    this.service.save(value)
      .then((res: any) => {
        console.log(res)
        this.get();
        this.formData = {};
        this.isVisible = false;
        this.message.success("success add Schedule")
      }).catch(() => { })
  }

  //detail
  linkDetail(time) {
    console.log(time)
    console.log(format(time, 'YYYY-MM-DD'))
    this.router.navigate(['/home/detail', time])
  }
}
